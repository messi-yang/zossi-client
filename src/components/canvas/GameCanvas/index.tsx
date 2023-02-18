import { useEffect, useState, useRef, useContext } from 'react';
import * as THREE from 'three';
import forEach from 'lodash/forEach';

import ThreeJsContext from '@/contexts/ThreeJsContext';
import { LocationVo } from '@/models/valueObjects';
import { ItemAgg, UnitAgg } from '@/models/aggregates';
import { PlayerEntity } from '@/models/entities';
import useDomRect from '@/hooks/useDomRect';
import dataTestids from './dataTestids';

type CachedObjectMap = {
  [key: number | string]: THREE.Group | undefined;
};

type Props = {
  players: PlayerEntity[];
  units: UnitAgg[];
  cameraLocation: LocationVo;
  items: ItemAgg[];
  selectedItemId: number | null;
};

function GameCanvas({ players, units, cameraLocation, items, selectedItemId }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const wrapperDomRect = useDomRect(wrapperRef);
  const [scene] = useState<THREE.Scene>(() => {
    const newScene = new THREE.Scene();
    newScene.background = new THREE.Color(0xffffff);

    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(0, 10, 0);
    newScene.add(dirLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
    hemiLight.position.set(0, 10, 0);
    newScene.add(hemiLight);

    const grid = new THREE.GridHelper(300, 300, 0x000000, 0x000000);
    // @ts-ignore
    grid.material.opacity = 0.2;
    // @ts-ignore
    grid.material.transparent = true;
    newScene.add(grid);

    return newScene;
  });
  const [camera] = useState<THREE.PerspectiveCamera>(() => {
    const newCamera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000);
    scene.add(newCamera);
    return newCamera;
  });
  const [renderer] = useState<THREE.WebGLRenderer>(() => {
    const newRender = new THREE.WebGLRenderer({ antialias: true });
    newRender.outputEncoding = THREE.sRGBEncoding;
    return newRender;
  });
  const { loadModel, cloneModel } = useContext(ThreeJsContext);
  const cachedPlayerObjects = useRef<CachedObjectMap>({});
  const cachedUnitObjects = useRef<CachedObjectMap>({});

  useEffect(() => {
    console.log(selectedItemId);
    items.forEach((item) => loadModel(item.getModelSrc()));
    loadModel('/characters/chicken.gltf');
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
    function updateCameraPositionOnCameraLocationChange() {
      camera.position.set(cameraLocation.getX(), 35, cameraLocation.getZ() + 40);
      camera.lookAt(cameraLocation.getX(), 0, cameraLocation.getZ());
    },
    [camera, cameraLocation]
  );

  useEffect(
    function updateCameraAspectOnWrapperDomRectChange() {
      if (!wrapperDomRect) {
        return;
      }
      camera.aspect = wrapperDomRect.width / wrapperDomRect.height;
      camera.updateProjectionMatrix();
    },
    [camera, cameraLocation, wrapperDomRect]
  );

  useEffect(
    function handlePlayersUpdated() {
      players.forEach((player) => {
        let playerObject: THREE.Group | null;
        const cachedPlayerOject = cachedPlayerObjects.current[player.getId()];

        if (cachedPlayerOject) {
          playerObject = cachedPlayerOject;
        } else {
          playerObject = cloneModel('/characters/chicken.gltf');
          if (playerObject) {
            scene.add(playerObject);
            cachedPlayerObjects.current[player.getId()] = playerObject;
          }
        }

        if (!playerObject) return;

        playerObject.position.set(player.getLocation().getX(), 0, player.getLocation().getZ());
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
            scene.add(unitObject);
            cachedUnitObjects.current[unitId] = unitObject;
          }
        }

        if (!unitObject) return;

        unitObject.position.set(unit.getLocation().getX(), 0, unit.getLocation().getZ());
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
      const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };

      animate();
    },
    [renderer, scene, camera]
  );

  return <div data-testid={dataTestids.root} ref={wrapperRef} className="relative w-full h-full flex" />;
}

export default GameCanvas;
export { dataTestids };
