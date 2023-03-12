import { useEffect, useState, useRef, useContext } from 'react';
import * as THREE from 'three';
import forEach from 'lodash/forEach';

import ThreeJsContext from '@/contexts/ThreeJsContext';
import { PositionVo } from '@/models/valueObjects';
import { ItemAgg, UnitAgg, PlayerAgg } from '@/models/aggregates';
import useDomRect from '@/hooks/useDomRect';
import { enableShadowOnObject } from '@/libs/threeHelper';
import dataTestids from './dataTestids';

type CachedObjectMap = Record<number | string, THREE.Group | undefined>;

type Props = {
  players: PlayerAgg[];
  units: UnitAgg[];
  myPlayerPosition: PositionVo;
  items: ItemAgg[];
};

const CHARACTER_MODEL_SRC = '/characters/robot.gltf';
const BASE_MODEL_SRC = '/bases/grass.gltf';
const CAMERA_HEIGHT = 20;
const CAMERA_Z_OFFSET = 20;
const DIR_LIGHT_HEIGHT = 20;
const DIR_LIGHT_Z_OFFSET = 20;
const HEMI_LIGHT_HEIGHT = 20;

function GameCanvas({ players, units, myPlayerPosition, items }: Props) {
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
  const { loadModel, cloneModel } = useContext(ThreeJsContext);
  const cachedPlayerObjects = useRef<CachedObjectMap>({});
  const cachedUnitObjects = useRef<CachedObjectMap>({});

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
    function handleBasesUpdated() {
      const grassObject = cloneModel(BASE_MODEL_SRC);
      if (!grassObject) return;

      enableShadowOnObject(grassObject);
      grassObject.position.set(0, -0.15, 0);
      grassObject.scale.set(1000, 1, 1000);
      scene.add(grassObject);
    },
    [scene, cloneModel]
  );

  useEffect(
    function handlePlayersUpdated() {
      players.forEach((player) => {
        let playerObject: THREE.Group | null;
        const cachedPlayerOject = cachedPlayerObjects.current[player.getId()];

        if (cachedPlayerOject) {
          playerObject = cachedPlayerOject;
        } else {
          playerObject = cloneModel(CHARACTER_MODEL_SRC);
          if (playerObject) {
            scene.add(playerObject);
            cachedPlayerObjects.current[player.getId()] = playerObject;
            enableShadowOnObject(playerObject);
          }
        }

        if (playerObject) {
          playerObject.position.set(player.getPosition().getX() + 0.5, 0, player.getPosition().getZ() + 0.5);
          playerObject.rotation.y = Math.PI - (player.getDirection().toNumber() * Math.PI) / 2;
        }
      });

      const playerKeys = players.map((player) => player.getId());
      forEach(cachedPlayerObjects.current, (playerObject, playerId) => {
        if (!playerKeys.includes(playerId) && playerObject) {
          scene.remove(playerObject);
          delete cachedPlayerObjects.current[playerId];
        }
      });
    },
    [scene, cloneModel, players]
  );

  useEffect(
    function handleUnitsUpdated() {
      units.forEach((unit) => {
        const item = items.find((_item) => _item.getId() === unit.getItemId());
        if (!item) return;

        const unitId = unit.getIdentifier();
        let unitObject: THREE.Group | null;
        const cachedUnitOject = cachedUnitObjects.current[unitId];

        if (cachedUnitOject) {
          unitObject = cachedUnitOject;
        } else {
          unitObject = cloneModel(item.getModelSrc());
          if (unitObject) {
            enableShadowOnObject(unitObject);
            scene.add(unitObject);
            cachedUnitObjects.current[unitId] = unitObject;
          }
        }

        if (unitObject) {
          unitObject.position.set(unit.getPosition().getX() + 0.5, 0, unit.getPosition().getZ() + 0.5);
        }
      });

      const unitIds = units.map((unit) => unit.getIdentifier());
      forEach(cachedUnitObjects.current, (unitObject, unitId) => {
        if (!unitIds.includes(unitId) && unitObject) {
          scene.remove(unitObject);
          delete cachedUnitObjects.current[unitId];
        }
      });
    },
    [scene, cloneModel, items, units]
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
