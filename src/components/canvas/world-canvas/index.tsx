import { useEffect, useState, useRef, useContext, useMemo } from 'react';
import * as THREE from 'three';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

import { ItemModel, UnitModel, PlayerModel, WorldModel } from '@/models';
import { useDomRect } from '@/hooks/use-dom-rect';

import { TjsContext } from '@/contexts/tjs-context';
import { rangeMatrix } from '@/libs/common';
import { createInstancesInScene } from './tjs-utils';
import { dataTestids } from './data-test-ids';

type Props = {
  cameraDistance: number;
  world: WorldModel;
  otherPlayers: PlayerModel[];
  myPlayer: PlayerModel;
  units: UnitModel[];
  items: ItemModel[];
};

const CHARACTER_MODEL_SRC = '/characters/car.gltf';
const BASE_MODEL_SRC = '/assets/3d/scene/lawn.gltf';
const FONT_SRC = 'https://cdn.jsdelivr.net/npm/three/examples/fonts/helvetiker_regular.typeface.json';
const CAMERA_FOV = 50;
const DIR_LIGHT_HEIGHT = 20;
const DIR_LIGHT_Z_OFFSET = 20;
const HEMI_LIGHT_HEIGHT = 20;

export function WorldCanvas({ cameraDistance, world, otherPlayers, units, myPlayer, items }: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const wrapperDomRect = useDomRect(wrapperRef);

  const [myPlayerPositionX, myPlayerPositionZ] = [myPlayer.getPosition().getX(), myPlayer.getPosition().getZ()];
  const worldBound = useMemo(() => world.getBound(), [world]);

  const [scene] = useState<THREE.Scene>(() => {
    const newScene = new THREE.Scene();
    newScene.background = new THREE.Color(0x87ceeb);
    // scene.background = new THREE.Color(0x87ceeb);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x888888, 0.5);
    hemiLight.position.set(0, HEMI_LIGHT_HEIGHT, 0);
    newScene.add(hemiLight);

    return newScene;
  });
  useState<THREE.Group>(() => {
    const material = new THREE.LineBasicMaterial({ color: 0xdddddd, opacity: 0.2, transparent: true });
    const offsetX = worldBound.getFrom().getX();
    const offsetZ = worldBound.getFrom().getZ();
    const boundWidth = worldBound.getWidth();
    const boundheight = worldBound.getHeight();
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
    newGrid.position.set(0, 0.1, 0);
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
  const { downloadTjsModel, downloadTjsFont } = useContext(TjsContext);

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
      renderer.setPixelRatio(2);
    },
    [renderer, wrapperDomRect]
  );

  useEffect(
    function updateCameraOnPositionChange() {
      const CAMERA_Y_OFFSET = cameraDistance * Math.sin((45 / 360) * 2 * Math.PI) + 0.5;
      const CAMERA_Z_OFFSET = cameraDistance * Math.cos((45 / 360) * 2 * Math.PI) + 0.5;

      camera.position.set(myPlayerPositionX, CAMERA_Y_OFFSET, myPlayerPositionZ + CAMERA_Z_OFFSET);
      camera.lookAt(myPlayerPositionX, 0, myPlayerPositionZ);
    },
    [myPlayerPositionX, myPlayerPositionZ, cameraDistance]
  );

  useEffect(
    function updateDirLightOnPositionChange() {
      dirLight.position.set(myPlayerPositionX, DIR_LIGHT_HEIGHT, myPlayerPositionZ + DIR_LIGHT_Z_OFFSET);
      dirLight.target.position.set(myPlayerPositionX, 0, myPlayerPositionZ);
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
    function updateBaseOnWorldBoundUpdate() {
      const lawnModel = downloadTjsModel(BASE_MODEL_SRC);
      if (!lawnModel) return () => {};

      const boundOffsetX = worldBound.getFrom().getX();
      const boundOffsetZ = worldBound.getFrom().getZ();
      const worldBoundWidth = worldBound.getWidth();
      const worldBoundHeight = worldBound.getHeight();
      const grassInstanceStates: { x: number; y: number; z: number; rotate: number }[] = [];
      rangeMatrix(worldBoundWidth, worldBoundHeight, (colIdx, rowIdx) => {
        grassInstanceStates.push({
          x: boundOffsetX + colIdx + 0.5,
          y: 0,
          z: boundOffsetZ + rowIdx + 0.5,
          rotate: 0,
        });
      });
      const [removeInstancesFromScene] = createInstancesInScene(scene, lawnModel, grassInstanceStates);
      return () => {
        removeInstancesFromScene();
      };
    },
    [scene, downloadTjsModel, worldBound]
  );

  useEffect(
    function updatePlayers() {
      const players = [...otherPlayers, myPlayer];
      const playerInstanceStates = players.map((player) => ({
        x: player.getPosition().getX() + 0.5,
        y: 0,
        z: player.getPosition().getZ() + 0.5,
        rotate: (player.getDirection().toNumber() * Math.PI) / 2,
      }));

      let removeInstancesFromScene: (() => void) | null = null;
      const playerModel = downloadTjsModel(CHARACTER_MODEL_SRC);
      if (playerModel) {
        [removeInstancesFromScene] = createInstancesInScene(scene, playerModel, playerInstanceStates);
      }

      return () => {
        removeInstancesFromScene?.();
      };
    },
    [scene, downloadTjsModel, myPlayer, otherPlayers]
  );

  useEffect(
    function updatePlayers() {
      const players = [...otherPlayers, myPlayer];

      const font = downloadTjsFont(FONT_SRC);
      const playerNameMeshes: THREE.Mesh<TextGeometry, THREE.MeshBasicMaterial>[] = [];
      if (font) {
        players.forEach((player) => {
          const textGeometry = new TextGeometry(player.getName(), {
            font,
            size: 0.35,
            height: 0.05,
          });
          const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.7, transparent: true });
          const playerNameMesh = new THREE.Mesh(textGeometry, textMaterial);

          textGeometry.computeBoundingBox();
          textGeometry.center();
          playerNameMesh.position.set(player.getPosition().getX() + 0.5, 1.5, player.getPosition().getZ() + 0.5);
          playerNameMesh.rotation.set(-Math.PI / 6, 0, 0);
          playerNameMeshes.push(playerNameMesh);
          scene.add(playerNameMesh);
        });
      }

      return () => {
        playerNameMeshes.forEach((playerNameMesh) => {
          scene.remove(playerNameMesh);
        });
      };
    },
    [scene, downloadTjsFont, myPlayer, otherPlayers]
  );

  const itemUnitsMap = useMemo<Record<string, UnitModel[]>>(() => {
    const result: Record<string, UnitModel[]> = {};
    units.forEach((unit) => {
      if (!result[unit.getItemId()]) {
        result[unit.getItemId()] = [];
      }
      result[unit.getItemId()].push(unit);
    });
    return result;
  }, [units]);

  useEffect(
    function updateUnits() {
      const removeInstancesFromSceneExecutors: (() => void)[] = [];
      Object.keys(itemUnitsMap).forEach((itemId) => {
        const itemUnits = itemUnitsMap[itemId];
        const item = items.find((_item) => _item.getId() === itemId);
        if (!item) return;

        const itemModel = downloadTjsModel(item.getModelSrc());
        if (!itemModel) return;

        const itemUnitInstanceStates = itemUnits.map((unit) => ({
          x: unit.getPosition().getX() + 0.5,
          y: 0,
          z: unit.getPosition().getZ() + 0.5,
          rotate: (Math.PI / 2) * unit.getDirection().toNumber(),
        }));
        const [removeInstancesFromScene] = createInstancesInScene(scene, itemModel, itemUnitInstanceStates);
        removeInstancesFromSceneExecutors.push(removeInstancesFromScene);
      });

      return () => {
        removeInstancesFromSceneExecutors.forEach((executor) => {
          executor();
        });
      };
    },
    [scene, downloadTjsModel, items, itemUnitsMap]
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
          if (animateCount % 600 === 0) console.log(`Render Information: ${JSON.stringify(renderer.info.render)}`);
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
