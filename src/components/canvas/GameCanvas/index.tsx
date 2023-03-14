import { useEffect, useState, useRef, useContext } from 'react';
import * as THREE from 'three';

import { BoundVo } from '@/models/valueObjects';
import { ItemAgg, UnitAgg, PlayerAgg } from '@/models/aggregates';
import useDomRect from '@/hooks/useDomRect';

import ThreeJsContext from '@/contexts/ThreeJsContext';
import { rangeMatrix } from '@/libs/common';
import useObjectCache from './useObjectCache';
import dataTestids from './dataTestids';

type InstancedMeshInfo = {
  mesh: THREE.InstancedMesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>;
  worldScale: THREE.Vector3;
  worldPosition: THREE.Vector3;
  worldQuaternion: THREE.Quaternion;
};

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

      const baseObjMeshes: THREE.Mesh[] = [];
      baseObject.traverse((node) => {
        const currentNode = node as THREE.Mesh;
        if (currentNode.isMesh) baseObjMeshes.push(currentNode);
      });

      const grassObjInstancedMeshInfos: InstancedMeshInfo[] = baseObjMeshes.map((baseObjMesh) => {
        const mesh = new THREE.InstancedMesh(
          baseObjMesh.geometry,
          baseObjMesh.material,
          visionBoundWidth * visionBoundHeight
        );
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        return {
          mesh,
          worldScale: baseObjMesh.getWorldScale(new THREE.Vector3()),
          worldPosition: baseObjMesh.getWorldPosition(new THREE.Vector3()),
          worldQuaternion: baseObjMesh.getWorldQuaternion(new THREE.Quaternion()),
        };
      });

      let index = 0;
      rangeMatrix(visionBoundWidth, visionBoundHeight, (colIdx, rowIdx) => {
        grassObjInstancedMeshInfos.forEach(({ mesh, worldScale, worldQuaternion, worldPosition }) => {
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

      grassObjInstancedMeshInfos.forEach(({ mesh }) => {
        scene.add(mesh);
      });

      return () => {
        grassObjInstancedMeshInfos.forEach(({ mesh }) => {
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
      const itemUnitsMap: Record<string, UnitAgg[]> = {};
      units.forEach((unit) => {
        if (!itemUnitsMap[unit.getItemId()]) {
          itemUnitsMap[unit.getItemId()] = [];
        }
        itemUnitsMap[unit.getItemId()].push(unit);
      });

      let totalItemIntstancedMeshInfosMap: InstancedMeshInfo[] = [];
      Object.keys(itemUnitsMap).forEach((itemId) => {
        const itemUnits = itemUnitsMap[itemId];
        const item = items.find((_item) => _item.getId() === itemId);
        if (!item) return;

        const itemObj = createObject(item.getModelSrc());
        if (!itemObj) return;

        const itemObjMeshes: THREE.Mesh[] = [];
        itemObj.traverse((node) => {
          const currentNode = node as THREE.Mesh;
          if (currentNode.isMesh) itemObjMeshes.push(currentNode);
        });
        const itemInstancedMeshInfos: InstancedMeshInfo[] = itemObjMeshes.map((itemObjMesh) => {
          const mesh = new THREE.InstancedMesh(itemObjMesh.geometry, itemObjMesh.material, itemUnits.length);
          mesh.castShadow = true;
          mesh.receiveShadow = true;
          return {
            mesh,
            worldScale: itemObjMesh.getWorldScale(new THREE.Vector3()),
            worldPosition: itemObjMesh.getWorldPosition(new THREE.Vector3()),
            worldQuaternion: itemObjMesh.getWorldQuaternion(new THREE.Quaternion()),
          };
        });
        totalItemIntstancedMeshInfosMap = totalItemIntstancedMeshInfosMap.concat(itemInstancedMeshInfos);

        itemUnits.forEach((unit, unitIdx) => {
          itemInstancedMeshInfos.forEach(({ mesh, worldScale, worldQuaternion, worldPosition }) => {
            const [objectPosX, objectPosZ] = [unit.getPosition().getX() + 0.5, unit.getPosition().getZ() + 0.5];
            const position = new THREE.Vector3(
              objectPosX + worldPosition.x,
              worldPosition.y,
              objectPosZ + worldPosition.z
            );
            const matrix = new THREE.Matrix4().compose(position, worldQuaternion, worldScale);
            mesh.setMatrixAt(unitIdx, matrix);
          });
        });
        itemInstancedMeshInfos.forEach(({ mesh }) => {
          scene.add(mesh);
        });
      });

      return () => {
        totalItemIntstancedMeshInfosMap.forEach(({ mesh }) => {
          scene.remove(mesh);
        });
      };
    },
    [scene, createObject, items, units]
  );

  useEffect(
    function animateEffect() {
      const maxFPS = 60;
      const frameDelay = 1000 / maxFPS;
      let lastFrameTime = 0;
      let animateCount = 0;

      function animate() {
        const currentTime = performance.now();
        const elapsed = currentTime - lastFrameTime;
        if (elapsed > frameDelay) {
          if (animateCount % 60 === 0) console.log(`Render Information: ${JSON.stringify(renderer.info.render)}`);
          lastFrameTime = currentTime - (elapsed % frameDelay);
          renderer.render(scene, camera);
          animateCount += 1;
        }
        requestAnimationFrame(animate);
      }
      animate();
    },
    [renderer, scene, camera]
  );

  return <div data-testid={dataTestids.root} ref={wrapperRef} className="relative w-full h-full flex" />;
}

export default GameCanvas;
export { dataTestids };
