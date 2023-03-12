import { useEffect, useState, useRef, useContext } from 'react';
import * as THREE from 'three';

import { BoundVo, PositionVo } from '@/models/valueObjects';
import { ItemAgg, UnitAgg, PlayerAgg } from '@/models/aggregates';
import useDomRect from '@/hooks/useDomRect';

import ThreeJsContext from '@/contexts/ThreeJsContext';
import useObjectCache from './useObjectCache';
import dataTestids from './dataTestids';

type Props = {
  players: PlayerAgg[];
  units: UnitAgg[];
  myPlayerPosition: PositionVo;
  items: ItemAgg[];
  visionBound: BoundVo;
};

const CHARACTER_MODEL_SRC = '/characters/robot.gltf';
const BASE_MODEL_SRC = '/bases/grass.gltf';
const CAMERA_HEIGHT = 20;
const CAMERA_Z_OFFSET = 20;
const DIR_LIGHT_HEIGHT = 20;
const DIR_LIGHT_Z_OFFSET = 20;
const HEMI_LIGHT_HEIGHT = 20;

function GameCanvas({ players, units, myPlayerPosition, items, visionBound }: Props) {
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
    for (let x = 0; x < boundWidth; x += 1) {
      const points: THREE.Vector3[] = [];
      points.push(new THREE.Vector3(x + offsetX, 0, offsetZ));
      points.push(new THREE.Vector3(x + offsetX, 0, offsetZ + boundheight));
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      newGrid.add(new THREE.Line(geometry, material));
    }
    for (let z = 0; z < boundheight; z += 1) {
      const points: THREE.Vector3[] = [];
      points.push(new THREE.Vector3(offsetX, 0, z + offsetZ));
      points.push(new THREE.Vector3(offsetX + boundWidth, 0, z + offsetZ));
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      newGrid.add(new THREE.Line(geometry, material));
    }
    newGrid.position.set(0, 0.01, 0);
    scene.add(newGrid);
    return newGrid;
  });
  const [dirLight] = useState<THREE.DirectionalLight>(() => {
    const newDirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    newDirLight.castShadow = true;
    newDirLight.position.set(0, DIR_LIGHT_HEIGHT, DIR_LIGHT_Z_OFFSET);
    newDirLight.target.position.set(0, 0, 0);
    newDirLight.shadow.mapSize.width = 4096;
    newDirLight.shadow.mapSize.height = 4096;
    newDirLight.shadow.camera.top = 100;
    newDirLight.shadow.camera.bottom = -100;
    newDirLight.shadow.camera.left = -100;
    newDirLight.shadow.camera.right = 100;
    newDirLight.shadow.camera.near = 0.5;
    newDirLight.shadow.camera.far = 500;
    scene.add(newDirLight);
    scene.add(newDirLight.target);
    return newDirLight;
  });
  const [camera] = useState<THREE.PerspectiveCamera>(() => {
    const newCamera = new THREE.PerspectiveCamera(40, 1, 0.1, 1000);
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
  const playerObjectCache = useObjectCache(scene);
  const unitObjectCache = useObjectCache(scene);

  useEffect(() => {
    items.forEach((item) => loadModel(item.getModelSrc()));
    loadModel(CHARACTER_MODEL_SRC);
    loadModel(BASE_MODEL_SRC);
  }, [items, players]);

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
      const myPlayerPositionX = myPlayerPosition.getX();
      const myPlayerPositionZ = myPlayerPosition.getZ();

      camera.position.set(myPlayerPositionX, CAMERA_HEIGHT, myPlayerPositionZ + CAMERA_Z_OFFSET);
      camera.lookAt(myPlayerPositionX, 0, myPlayerPositionZ);
    },
    [myPlayerPosition]
  );

  useEffect(
    function updateDirLightOnPositionChange() {
      const myPlayerPositionX = myPlayerPosition.getX();
      const myPlayerPositionZ = myPlayerPosition.getZ();

      dirLight.position.set(myPlayerPositionX, DIR_LIGHT_HEIGHT, myPlayerPositionZ + DIR_LIGHT_Z_OFFSET);
      dirLight.target.position.set(myPlayerPositionX, 0, myPlayerPositionZ);
    },
    [myPlayerPosition]
  );

  useEffect(
    function updateGridOnPositionChange() {
      const myPlayerPositionX = myPlayerPosition.getX();
      const myPlayerPositionZ = myPlayerPosition.getZ();

      grid.position.set(myPlayerPositionX, 0.01, myPlayerPositionZ);
    },
    [myPlayerPosition]
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

  // const baseObjectCache = useObjectCache(scene);
  // useEffect(
  //   function handleBasesUpdated() {
  //     const xOffset = bound.getFrom().getX();
  //     const zOffset = bound.getFrom().getZ();

  //     const baseObjectIds: string[] = [];
  //     rangeMatrix(bound.getWidth(), bound.getHeight(), (colIdx, rowIdx) => {
  //       const baseObjectId = `${xOffset + colIdx},${zOffset + rowIdx}`;
  //       baseObjectIds.push(baseObjectId);

  //       let baseObject = baseObjectCache.getObjectFromScene(baseObjectId);
  //       if (!baseObject) {
  //         baseObject = createObject(BASE_MODEL_SRC);
  //         if (!baseObject) return;

  //         baseObjectCache.addObjectToScene(baseObjectId, baseObject);
  //       }

  //       baseObject.position.set(xOffset + colIdx + 0.5, 0, zOffset + rowIdx + 0.5);
  //     });

  //     baseObjectCache.recycleObjectsFromScene(baseObjectIds);
  //   },
  //   [scene, createObject]
  // );

  useEffect(
    function handleBasesUpdated() {
      const grassObject = createObject(BASE_MODEL_SRC);
      if (!grassObject) return () => {};

      grassObject.position.set(myPlayerPosition.getX(), 0, myPlayerPosition.getZ());
      scene.add(grassObject);

      return () => {
        scene.remove(grassObject);
      };
    },
    [scene, createObject, myPlayerPosition]
  );

  useEffect(
    function handlePlayersUpdated() {
      players.forEach((player) => {
        let playerObject = playerObjectCache.getObjectFromScene(player.getId());
        if (!playerObject) {
          playerObject = createObject(CHARACTER_MODEL_SRC);
          if (!playerObject) return;

          playerObjectCache.addObjectToScene(player.getId(), playerObject);
        }

        playerObject.position.set(player.getPosition().getX() + 0.5, 0, player.getPosition().getZ() + 0.5);
        playerObject.rotation.y = Math.PI - (player.getDirection().toNumber() * Math.PI) / 2;
      });

      const playerKeys = players.map((player) => player.getId());
      playerObjectCache.recycleObjectsFromScene(playerKeys);
    },
    [scene, createObject, players]
  );

  useEffect(
    function handleUnitsUpdated() {
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
