import { useEffect, useRef, useContext } from 'react';
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
  const scene = useRef<THREE.Scene | null>(null);
  const camera = useRef<THREE.PerspectiveCamera | null>(null);
  const renderer = useRef<THREE.WebGLRenderer | null>(null);
  const playerModels = useRef<THREE.Group[]>([]);
  const unitModels = useRef<THREE.Group[]>([]);
  // const [grassModelSource, setGrassModelSource] = useState<THREE.Group | null>(null);
  const { cachedModels, loadModel } = useContext(ThreeJsContext);

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

      scene.current = new THREE.Scene();
      scene.current.background = new THREE.Color(0xffffff);

      camera.current = new THREE.PerspectiveCamera(30, 1, wrapperDomRect.width / wrapperDomRect.height, 1000);
      scene.current.add(camera.current);

      renderer.current = new THREE.WebGLRenderer({ antialias: true });
      renderer.current.outputEncoding = THREE.sRGBEncoding;
      wrapperRef.current.appendChild(renderer.current.domElement);

      renderer.current.render(scene.current, camera.current);

      const dirLight = new THREE.DirectionalLight(0xffffff);
      dirLight.position.set(0, 10, 0);
      scene.current.add(dirLight);

      const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
      hemiLight.position.set(0, 10, 0);
      scene.current.add(hemiLight);

      const axesHelper = new THREE.AxesHelper(100);
      const redColor = new THREE.Color(0xef4444);
      const yellowColor = new THREE.Color(0xeab308);
      const blueColor = new THREE.Color(0x3b82f6);
      axesHelper.setColors(redColor, yellowColor, blueColor);
      scene.current.add(axesHelper);
    },
    [wrapperRef.current]
  );

  useEffect(
    function handleWrapperDomRectChange() {
      if (!renderer.current || !wrapperDomRect) {
        return;
      }
      renderer.current.setSize(wrapperDomRect.width, wrapperDomRect.height);
      renderer.current.setPixelRatio(wrapperDomRect.width / wrapperDomRect.height);
    },
    [wrapperDomRect]
  );

  useEffect(
    function handleCameraLocationChange() {
      if (!camera.current || !wrapperDomRect) {
        return;
      }
      camera.current.position.set(cameraLocation.getX(), 15, cameraLocation.getZ() + 40);
      camera.current.lookAt(cameraLocation.getX(), 0, cameraLocation.getZ());
      camera.current.aspect = wrapperDomRect.width / wrapperDomRect.height;
      camera.current.updateProjectionMatrix();
    },
    [cameraLocation, wrapperDomRect]
  );

  // useEffect(
  //   function handleGrassUpdated() {
  //     const sceneCache = scene.current;
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
          if (!scene.current) return;
          scene.current.remove(playerModel);
        });
      }

      const newPlayerModels: THREE.Group[] = [];
      players.forEach((player) => {
        if (!scene.current) {
          return;
        }

        const playerModelSource = cachedModels['/characters/chicken.gltf'];
        if (!playerModelSource || playerModelSource === 'loading') return;

        const newPlayerModel = playerModelSource.clone();
        newPlayerModel.position.set(player.getLocation().getX(), 0, player.getLocation().getZ());
        newPlayerModel.scale.multiplyScalar(1);
        scene.current.add(newPlayerModel);
        newPlayerModels.push(newPlayerModel);
      });
      playerModels.current = newPlayerModels;
    },
    [cachedModels, players]
  );

  useEffect(
    function handleUnitsUpdated() {
      if (!scene.current) {
        return;
      }

      unitModels.current?.forEach((unitModel) => {
        if (!scene.current) return;
        scene.current.remove(unitModel);
      });

      const newUnitModels: THREE.Group[] = [];
      view.getUnits().forEach((unit) => {
        if (!scene.current) return;

        const item = items.find((_item) => _item.getId() === unit.getItemId());
        if (!item) return;

        const itemModelSource = cachedModels[item.getModelSrc()];
        if (!itemModelSource || itemModelSource === 'loading') return;

        const newUnitModel = itemModelSource.clone();
        newUnitModel.position.set(unit.getLocation().getX(), 0, unit.getLocation().getZ());
        scene.current.add(newUnitModel);
        newUnitModels.push(newUnitModel);
      });
      unitModels.current = newUnitModels;
    },
    [cachedModels, items, view]
  );

  useEffect(function animateEffect() {
    const animate = () => {
      requestAnimationFrame(animate);

      if (!scene.current || !camera.current || !renderer.current) {
        return;
      }

      renderer.current.render(scene.current, camera.current);
    };

    animate();
  }, []);

  return <div data-testid={dataTestids.root} ref={wrapperRef} className="relative w-full h-full flex" />;
}

export default GameCanvas;
export { dataTestids };
