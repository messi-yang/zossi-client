import { useEffect, useState, useRef, useContext } from 'react';
import * as THREE from 'three';

import { BoundVo } from '@/models/valueObjects';
import { ItemAgg, UnitAgg, PlayerAgg } from '@/models/aggregates';
import useDomRect from '@/hooks/useDomRect';

import ThreeJsContext from '@/contexts/ThreeJsContext';
import { rangeMatrix } from '@/libs/common';
import use3dObjectPool from './use3dObjectPool';
import dataTestids from './dataTestids';

type InstancedMeshInfo = {
  mesh: THREE.InstancedMesh<THREE.BufferGeometry, THREE.Material | THREE.Material[]>;
  meshScale: THREE.Vector3;
  meshPosition: THREE.Vector3;
  meshQuaternion: THREE.Quaternion;
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
  const player3dObjectPool = use3dObjectPool(scene);

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
          meshScale: baseObjMesh.getWorldScale(new THREE.Vector3()),
          meshPosition: baseObjMesh.getWorldPosition(new THREE.Vector3()),
          meshQuaternion: baseObjMesh.getWorldQuaternion(new THREE.Quaternion()),
        };
      });

      let index = 0;
      rangeMatrix(visionBoundWidth, visionBoundHeight, (colIdx, rowIdx) => {
        grassObjInstancedMeshInfos.forEach(({ mesh, meshScale, meshQuaternion, meshPosition }) => {
          const posX = boundOffsetX + colIdx + 0.5;
          const posZ = boundOffsetZ + rowIdx + 0.5;
          const position = new THREE.Vector3(posX + meshPosition.x, meshPosition.y, posZ + meshPosition.z);
          const matrix = new THREE.Matrix4().compose(position, meshQuaternion, meshScale);
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
    [scene, createObject, visionBound]
  );

  useEffect(
    function updateOnMyPlayerChange() {
      const playerObject = createObject(CHARACTER_MODEL_SRC);
      if (!playerObject) return () => {};

      scene.add(playerObject);

      playerObject.position.set(myPlayer.getPosition().getX() + 0.5, 0, myPlayer.getPosition().getZ() + 0.5);
      playerObject.rotation.y = (myPlayer.getDirection().toNumber() * Math.PI) / 2;

      return () => {
        scene.remove(playerObject);
      };
    },
    [scene, createObject, myPlayer]
  );

  useEffect(
    function updatePlayers() {
      otherPlayers.forEach((player) => {
        let playerObject = player3dObjectPool.getObjectFromScene(player.getId());
        if (!playerObject) {
          playerObject = createObject(CHARACTER_MODEL_SRC);
          if (!playerObject) return;

          player3dObjectPool.addObjectToScene(player.getId(), playerObject);
        }

        playerObject.position.set(player.getPosition().getX() + 0.5, 0, player.getPosition().getZ() + 0.5);
        playerObject.rotation.y = Math.PI - (player.getDirection().toNumber() * Math.PI) / 2;
      });

      const playerKeys = otherPlayers.map((player) => player.getId());
      player3dObjectPool.recycleObjectsFromScene(playerKeys);
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
            meshScale: itemObjMesh.getWorldScale(new THREE.Vector3()),
            meshPosition: itemObjMesh.getWorldPosition(new THREE.Vector3()),
            meshQuaternion: itemObjMesh.getWorldQuaternion(new THREE.Quaternion()),
          };
        });
        totalItemIntstancedMeshInfosMap = totalItemIntstancedMeshInfosMap.concat(itemInstancedMeshInfos);

        itemUnits.forEach((unit, unitIdx) => {
          itemInstancedMeshInfos.forEach(({ mesh, meshScale, meshQuaternion, meshPosition }) => {
            const [unitPosX, unitPosZ] = [unit.getPosition().getX() + 0.5, unit.getPosition().getZ() + 0.5];
            const unitRotate = (Math.PI / 2) * unit.getDirection().toNumber();

            const meshOrbitRadius = Math.sqrt(meshPosition.x * meshPosition.x + meshPosition.z * meshPosition.z);
            let meshOrbitalAngle = meshOrbitRadius !== 0 ? Math.asin(meshPosition.z / meshOrbitRadius) : 0;
            meshOrbitalAngle = meshPosition.x >= 0 ? meshOrbitalAngle : Math.PI - meshOrbitalAngle;

            const meshPosAfterRotation = new THREE.Vector3(
              meshOrbitRadius * Math.cos(meshOrbitalAngle - unitRotate),
              meshPosition.y,
              meshOrbitRadius * Math.sin(meshOrbitalAngle - unitRotate)
            );

            const position = new THREE.Vector3(unitPosX, 0, unitPosZ).add(meshPosAfterRotation);
            const quaternion = new THREE.Quaternion()
              .setFromAxisAngle(new THREE.Vector3(0, 1, 0), unitRotate)
              .multiply(meshQuaternion);

            const matrix = new THREE.Matrix4().compose(position, quaternion, meshScale);
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

      let animateId: number | null = null;
      function animate() {
        const currentTime = performance.now();
        const elapsed = currentTime - lastFrameTime;
        if (elapsed > frameDelay) {
          if (animateCount % 60 === 0) console.log(`Render Information: ${JSON.stringify(renderer.info.render)}`);
          lastFrameTime = currentTime - (elapsed % frameDelay);
          renderer.render(scene, camera);
          animateCount += 1;
        }
        animateId = requestAnimationFrame(animate);
      }
      animate();

      return () => {
        if (animateId !== null) {
          cancelAnimationFrame(animateId);
        }
      };
    },
    [renderer, scene, camera]
  );

  return <div data-testid={dataTestids.root} ref={wrapperRef} className="relative w-full h-full flex" />;
}

export default GameCanvas;
export { dataTestids };
