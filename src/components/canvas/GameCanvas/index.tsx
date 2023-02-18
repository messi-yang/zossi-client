import { useEffect, useState, useRef, useContext } from 'react';
import * as THREE from 'three';

import ThreeJsContext from '@/contexts/ThreeJsContext';
import { ViewVo, LocationVo } from '@/models/valueObjects';
import { ItemAgg } from '@/models/aggregates';
import { PlayerEntity } from '@/models/entities';
import useDomRect from '@/hooks/useDomRect';
import dataTestids from './dataTestids';

type Props = {
  players: PlayerEntity[];
  view: ViewVo;
  cameraLocation: LocationVo;
  items: ItemAgg[];
  selectedItemId: number | null;
};

function GameCanvas({ players, view, cameraLocation, items, selectedItemId }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const wrapperDomRect = useDomRect(wrapperRef);
  const [scene] = useState<THREE.Scene>(() => new THREE.Scene());
  const [camera] = useState<THREE.PerspectiveCamera>(() => new THREE.PerspectiveCamera(30, 1, 0.1, 1000));
  const [renderer] = useState<THREE.WebGLRenderer>(() => {
    const newRender = new THREE.WebGLRenderer({ antialias: true });
    newRender.outputEncoding = THREE.sRGBEncoding;
    return newRender;
  });
  const playerModels = useRef<THREE.Group[]>([]);
  const unitModels = useRef<THREE.Group[]>([]);
  // const [grassModelSource, setGrassModelSource] = useState<THREE.Group | null>(null);
  const { loadModel, cloneModel } = useContext(ThreeJsContext);

  useEffect(() => {
    console.log(selectedItemId);
    items.forEach((item) => loadModel(item.getModelSrc()));
    loadModel('/characters/chicken.gltf');
  }, [items, players]);

  useEffect(
    function initScene() {
      if (!wrapperRef.current || !wrapperDomRect) {
        return;
      }

      scene.background = new THREE.Color(0xffffff);

      camera.aspect = wrapperDomRect.width / wrapperDomRect.height;
      scene.add(camera);

      wrapperRef.current.appendChild(renderer.domElement);
      renderer.render(scene, camera);

      const dirLight = new THREE.DirectionalLight(0xffffff);
      dirLight.position.set(0, 10, 0);
      scene.add(dirLight);

      const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
      hemiLight.position.set(0, 10, 0);
      scene.add(hemiLight);

      const grid = new THREE.GridHelper(300, 300, 0x000000, 0x000000);
      // @ts-ignore
      grid.material.opacity = 0.2;
      // @ts-ignore
      grid.material.transparent = true;
      scene.add(grid);
    },
    [wrapperRef.current]
  );

  useEffect(
    function handleWrapperDomRectChange() {
      if (!wrapperDomRect) {
        return;
      }
      renderer.setSize(wrapperDomRect.width, wrapperDomRect.height);
      renderer.setPixelRatio(wrapperDomRect.width / wrapperDomRect.height);
    },
    [renderer, wrapperDomRect]
  );

  useEffect(
    function handleCameraLocationChange() {
      if (!wrapperDomRect) {
        return;
      }
      camera.position.set(cameraLocation.getX(), 35, cameraLocation.getZ() + 40);
      camera.lookAt(cameraLocation.getX(), 0, cameraLocation.getZ());
      camera.aspect = wrapperDomRect.width / wrapperDomRect.height;
      camera.updateProjectionMatrix();
    },
    [camera, cameraLocation, wrapperDomRect]
  );

  // useEffect(
  //   function handleGrassUpdated() {
  //     const sceneCache = scene;
  //     if (!sceneCache) {
  //       return;
  //     }
  //     const grassModelSourceCache = grassModelSource;
  //     if (!grassModelSourceCache) {
  //       return;
  //     }

  //     const boundSize = view.getBound().getSize();
  //     rangeMatrix(boundSize.getWidth(), boundSize.getHeight(), (colIdx: number, rowIdx: number) => {
  // const newGrassModel = grassModelSourceCache.clone();
  // newGrassModel.position.set(colIdx, 0, rowIdx);
  // sceneCache.add(newGrassModel);
  // });
  //   },
  //   [view, grassModelSource]
  // );

  useEffect(
    function handlePlayersUpdated() {
      if (playerModels.current) {
        playerModels.current.forEach((playerModel) => {
          scene.remove(playerModel);
        });
      }

      const newPlayerModels: THREE.Group[] = [];
      players.forEach((player) => {
        const playerModelSource = cloneModel('/characters/chicken.gltf');
        if (!playerModelSource) return;

        const newPlayerModel = playerModelSource.clone();
        newPlayerModel.position.set(player.getLocation().getX(), 0, player.getLocation().getZ());
        newPlayerModel.scale.multiplyScalar(1);
        scene.add(newPlayerModel);
        newPlayerModels.push(newPlayerModel);
      });
      playerModels.current = newPlayerModels;
    },
    [scene, cloneModel, players]
  );

  useEffect(
    function handleUnitsUpdated() {
      unitModels.current?.forEach((unitModel) => {
        scene.remove(unitModel);
      });

      const newUnitModels: THREE.Group[] = [];
      view.getUnits().forEach((unit) => {
        const item = items.find((_item) => _item.getId() === unit.getItemId());
        if (!item) return;

        const itemModelSource = cloneModel(item.getModelSrc());
        if (!itemModelSource) return;

        const newUnitModel = itemModelSource.clone();
        newUnitModel.position.set(unit.getLocation().getX(), 0, unit.getLocation().getZ());
        scene.add(newUnitModel);
        newUnitModels.push(newUnitModel);
      });
      unitModels.current = newUnitModels;
    },
    [scene, cloneModel, items, view]
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
