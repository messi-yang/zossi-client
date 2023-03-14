import { useEffect, useState, useRef, useContext } from 'react';
import * as THREE from 'three';

import { BoundVo } from '@/models/valueObjects';
import { ItemAgg, UnitAgg, PlayerAgg } from '@/models/aggregates';
import useDomRect from '@/hooks/useDomRect';

import ThreeJsContext from '@/contexts/ThreeJsContext';
import { rangeMatrix } from '@/libs/common';
import useObjectCache from './useObjectCache';
import dataTestids from './dataTestids';

type Props = {
  otherPlayers: PlayerAgg[];
  myPlayer: PlayerAgg;
  units: UnitAgg[];
  items: ItemAgg[];
  visionBound: BoundVo;
};

const CHARACTER_MODEL_SRC = '/characters/robot.gltf';
const BASE_MODEL_SRC = '/bases/grass.gltf';
const CAMERA_FOV = 35;
const CAMERA_HEIGHT = 20;
const CAMERA_Z_OFFSET = 20;
const DIR_LIGHT_HEIGHT = 20;
const DIR_LIGHT_Z_OFFSET = 20;
const HEMI_LIGHT_HEIGHT = 20;

function GameCanvas({ otherPlayers, units, myPlayer, items, visionBound }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const wrapperDomRect = useDomRect(wrapperRef);
  const [scene] = useState<THREE.Scene>(() => {
    const newScene = new THREE.Scene();
    newScene.background = new THREE.Color(0xffffff);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x888888, 0.5);
    hemiLight.position.set(0, HEMI_LIGHT_HEIGHT, 0);
    newScene.add(hemiLight);

    return newScene;
  });
  const [grid] = useState<THREE.Group>(() => {
    const material = new THREE.LineBasicMaterial({ color: 0xffaf82 });
    const offsetX = visionBound.getFrom().getX();
    const offsetZ = visionBound.getFrom().getZ();
    const boundWidth = visionBound.getWidth();
    const boundheight = visionBound.getHeight();
    const newGrid = new THREE.Group();
    for (let x = 0; x <= boundWidth; x += 1) {
      const points: THREE.Vector3[] = [
        new THREE.Vector3(x + offsetX, 0, offsetZ),
        new THREE.Vector3(x + offsetX, 0, offsetZ + boundheight),
      ];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      newGrid.add(new THREE.Line(geometry, material));
    }
    for (let z = 0; z <= boundheight; z += 1) {
      const points: THREE.Vector3[] = [
        new THREE.Vector3(offsetX, 0, z + offsetZ),
        new THREE.Vector3(offsetX + boundWidth, 0, z + offsetZ),
      ];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      newGrid.add(new THREE.Line(geometry, material));
    }
    newGrid.position.set(0, 0, 0);
    scene.add(newGrid);
    return newGrid;
  });
  const [dirLight] = useState<THREE.DirectionalLight>(() => {
    const newDirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    newDirLight.castShadow = true;
    newDirLight.position.set(0, DIR_LIGHT_HEIGHT, DIR_LIGHT_Z_OFFSET);
    newDirLight.target.position.set(0, 0, 0);
    newDirLight.shadow.mapSize.set(4096, 4096);
    newDirLight.shadow.camera = new THREE.OrthographicCamera(-100, 100, 100, -100, 0.5, 500);
    scene.add(newDirLight);
    scene.add(newDirLight.target);
    return newDirLight;
  });
  const [camera] = useState<THREE.PerspectiveCamera>(() => {
    const newCamera = new THREE.PerspectiveCamera(CAMERA_FOV, 1, 0.1, 1000);
    scene.add(newCamera);
    return newCamera;
  });
  const [renderer] = useState<THREE.WebGLRenderer>(() => {
    const newRenderer = new THREE.WebGLRenderer({ antialias: true });
    newRenderer.outputEncoding = THREE.sRGBEncoding;
    newRenderer.shadowMap.enabled = true;
    newRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    return newRenderer;
  });
  const { loadModel, createObject } = useContext(ThreeJsContext);
  const [myPlayerPositionX, myPlayerPositionZ] = [myPlayer.getPosition().getX(), myPlayer.getPosition().getZ()];
  const playerObjectCache = useObjectCache(scene);
  const unitObjectCache = useObjectCache(scene);

  useEffect(() => {
    items.forEach((item) => loadModel(item.getModelSrc()));
    loadModel(CHARACTER_MODEL_SRC);
    loadModel(BASE_MODEL_SRC);
  }, [items]);

  useEffect(
    function putRendererOnWrapperRefReady() {
      if (!wrapperRef.current) {
        return;
      }

      wrapperRef.current.appendChild(renderer.domElement);
    },
    [wrapperRef.current]
  );

  useEffect(
    function updateRendererOnWrapperDomRectChange() {
      if (!wrapperDomRect) {
        return;
      }
      renderer.setSize(wrapperDomRect.width, wrapperDomRect.height);
      renderer.setPixelRatio(wrapperDomRect.width / wrapperDomRect.height);
    },
    [renderer, wrapperDomRect]
  );

  useEffect(
    function updateCameraOnPositionChange() {
      camera.position.set(myPlayerPositionX, CAMERA_HEIGHT, myPlayerPositionZ + CAMERA_Z_OFFSET);
      camera.lookAt(myPlayerPositionX, 0, myPlayerPositionZ);
    },
    [myPlayerPositionX, myPlayerPositionZ]
  );

  useEffect(
    function updateDirLightOnPositionChange() {
      dirLight.position.set(myPlayerPositionX, DIR_LIGHT_HEIGHT, myPlayerPositionZ + DIR_LIGHT_Z_OFFSET);
      dirLight.target.position.set(myPlayerPositionX, 0, myPlayerPositionZ);
    },
    [myPlayerPositionX, myPlayerPositionZ]
  );

  useEffect(
    function updateGridOnPositionChange() {
      grid.position.set(myPlayerPositionX, 0.01, myPlayerPositionZ);
    },
    [myPlayerPositionX, myPlayerPositionZ]
  );

  useEffect(
    function updateCameraAspectOnWrapperDomRectChange() {
      if (!wrapperDomRect) {
        return;
      }
      camera.aspect = wrapperDomRect.width / wrapperDomRect.height;
      camera.updateProjectionMatrix();
    },
    [camera, wrapperDomRect]
  );

  useEffect(
    function updateBaseOnVisionUpdate() {
      const baseObject = createObject(BASE_MODEL_SRC);
      if (!baseObject) return () => {};

      const boundOffsetX = visionBound.getFrom().getX();
      const boundOffsetZ = visionBound.getFrom().getZ();
      const visionBoundWidth = visionBound.getWidth();
      const visionBoundHeight = visionBound.getHeight();

      const objMeshes: THREE.Mesh[] = [];
      baseObject.traverse((node) => {
        const currentNode = node as THREE.Mesh;
        if (currentNode.isMesh) objMeshes.push(currentNode);
      });

      const instancedMeshes = objMeshes.map((mesh) => ({
        mesh: new THREE.InstancedMesh(mesh.geometry, mesh.material, visionBoundWidth * visionBoundHeight),
        worldScale: mesh.getWorldScale(new THREE.Vector3()),
        worldPosition: mesh.getWorldPosition(new THREE.Vector3()),
        worldQuaternion: mesh.getWorldQuaternion(new THREE.Quaternion()),
      }));

      let index = 0;
      rangeMatrix(visionBoundWidth, visionBoundHeight, (colIdx, rowIdx) => {
        instancedMeshes.forEach(({ mesh, worldScale, worldQuaternion, worldPosition }) => {
          const objectPosX = boundOffsetX + colIdx + 0.5;
          const objectPosZ = boundOffsetZ + rowIdx + 0.5;
          const position = new THREE.Vector3(
            objectPosX + worldPosition.x,
            worldPosition.y,
            objectPosZ + worldPosition.z
          );
          const matrix = new THREE.Matrix4().compose(position, worldQuaternion, worldScale);
          mesh.setMatrixAt(index, matrix);
        });
        index += 1;
      });

      instancedMeshes.forEach(({ mesh }) => {
        scene.add(mesh);
      });

      return () => {
        instancedMeshes.forEach(({ mesh }) => {
          scene.remove(mesh);
        });
      };
    },
    [scene, createObject, visionBound, myPlayerPositionX, myPlayerPositionZ]
  );

  useEffect(
    function updateOnMyPlayerChange() {
      const playerObject = createObject(CHARACTER_MODEL_SRC);
      if (!playerObject) return () => {};

      scene.add(playerObject);

      playerObject.position.set(myPlayer.getPosition().getX() + 0.5, 0, myPlayer.getPosition().getZ() + 0.5);
      playerObject.rotation.y = Math.PI - (myPlayer.getDirection().toNumber() * Math.PI) / 2;

      return () => {
        scene.remove(playerObject);
      };
    },
    [scene, createObject, myPlayer]
  );

  useEffect(
    function updatePlayers() {
      otherPlayers.forEach((player) => {
        let playerObject = playerObjectCache.getObjectFromScene(player.getId());
        if (!playerObject) {
          playerObject = createObject(CHARACTER_MODEL_SRC);
          if (!playerObject) return;

          playerObjectCache.addObjectToScene(player.getId(), playerObject);
        }

        playerObject.position.set(player.getPosition().getX() + 0.5, 0, player.getPosition().getZ() + 0.5);
        playerObject.rotation.y = Math.PI - (player.getDirection().toNumber() * Math.PI) / 2;
      });

      const playerKeys = otherPlayers.map((player) => player.getId());
      playerObjectCache.recycleObjectsFromScene(playerKeys);
    },
    [scene, createObject, otherPlayers]
  );

  useEffect(
    function updateUnits() {
      units.forEach((unit) => {
        const item = items.find((_item) => _item.getId() === unit.getItemId());
        if (!item) return;

        let unitObject = unitObjectCache.getObjectFromScene(unit.getIdentifier());
        if (!unitObject) {
          unitObject = createObject(item.getModelSrc());
          if (!unitObject) return;

          unitObjectCache.addObjectToScene(unit.getIdentifier(), unitObject);
        }

        unitObject.position.set(unit.getPosition().getX() + 0.5, 0, unit.getPosition().getZ() + 0.5);
      });

      const unitIds = units.map((unit) => unit.getIdentifier());
      unitObjectCache.recycleObjectsFromScene(unitIds);
    },
    [scene, createObject, items, units]
  );

  useEffect(
    function animateEffect() {
      let animationId: number | null = null;
      const animate = () => {
        animationId = requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };

      animate();

      return () => {
        if (animationId !== null) cancelAnimationFrame(animationId);
      };
    },
    [renderer, scene, camera]
  );

  return <div data-testid={dataTestids.root} ref={wrapperRef} className="relative w-full h-full flex" />;
}

export default GameCanvas;
export { dataTestids };
