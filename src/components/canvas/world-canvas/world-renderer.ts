import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader';

import { ItemModel } from '@/models/world/item/item-model';
import { UnitModel } from '@/models/world/unit/unit-model';
import { rangeMatrix } from '@/utils/common';
import { PositionVo } from '@/models/world/common/position-vo';
import { PrecisePositionVo } from '@/models/world/common/precise-position-vo';
import { BoundVo } from '@/models/world/common/bound-vo';
import { PlayerModel } from '@/models/world/player/player-model';
import { InstanceState, createInstancesInScene, createTextMesh } from './tjs-utils';
import { UnitTypeEnum } from '@/models/world/unit/unit-type-enum';
import { DirectionVo } from '@/models/world/common/direction-vo';

const CAMERA_FOV = 50;
const HEMI_LIGHT_HEIGHT = 20;
const DIR_LIGHT_HEIGHT = 20;
const DIR_LIGHT_Z_OFFSET = 20;
const BASE_MODEL_SRC = '/assets/3d/scene/lawn.gltf';
const DEFAULT_FONT_SRC = 'https://cdn.jsdelivr.net/npm/three/examples/fonts/helvetiker_regular.typeface.json';
const CHARACTER_MODEL_SRC = '/characters/car.gltf';

type ItemModelsDownloadedEventSubscriber = (itemId: string) => void;
type DefaultFontDownloadedEventSubscriber = () => void;
type PlayerModelDownloadedEventSubscriber = () => void;

export class WorldRenderer {
  private readonly scene: THREE.Scene;

  private camera: THREE.PerspectiveCamera;

  private readonly renderer: THREE.WebGLRenderer;

  private readonly directionalLight: THREE.DirectionalLight;

  private itemModelsMap: Record<string, THREE.Group[] | undefined> = {};

  private fontMap: Record<string, Font | undefined> = {};

  private defaultFontDownloadedEventSubscribers: DefaultFontDownloadedEventSubscriber[] = [];

  private existingPlayerNameFontMeshesMap: Record<string, THREE.Mesh> = {};

  private itemModelsDownloadedEventSubscribers: ItemModelsDownloadedEventSubscriber[] = [];

  private itemModelInstancesCleanerMap: Record<string, (() => void) | undefined> = {};

  private baseModelInstancesCleaner: () => void = () => {};

  private playerModel: THREE.Group | null = null;

  private playerModelDownloadedEventSubscribers: PlayerModelDownloadedEventSubscriber[] = [];

  private playerModelInstancesCleaner: () => void = () => {};

  constructor(worldBound: BoundVo) {
    this.scene = this.createScene();

    this.camera = this.createCamera();

    this.createGrid(worldBound);

    this.directionalLight = this.createDirectionalLight();
    this.scene.add(this.directionalLight);
    this.scene.add(this.directionalLight.target);

    this.renderer = this.createRenderer();

    this.createBase(worldBound);

    this.downloadDefaultFont(DEFAULT_FONT_SRC);
    this.downloadPlayerModel();
  }

  static new(worldBound: BoundVo) {
    return new WorldRenderer(worldBound);
  }

  public render() {
    this.renderer.render(this.scene, this.camera);
  }

  public mount(element: HTMLElement) {
    element.appendChild(this.renderer.domElement);
  }

  public destroy(element: HTMLElement) {
    this.baseModelInstancesCleaner();

    Object.values(this.existingPlayerNameFontMeshesMap).forEach((mesh) => {
      this.scene.remove(mesh);
    });

    Object.values(this.itemModelInstancesCleanerMap).forEach((cleaner) => {
      cleaner?.();
    });

    this.baseModelInstancesCleaner();

    element.removeChild(this.renderer.domElement);
  }

  private async downloadFont(fontSrc: string): Promise<Font> {
    const fontLoader = new FontLoader();
    return new Promise((resolve) => {
      fontLoader.load(fontSrc, (font) => {
        resolve(font);
      });
    });
  }

  private async downloadDefaultFont(fontSource: string) {
    const playerFont = await this.downloadFont(fontSource);
    this.fontMap[fontSource] = playerFont;

    this.defaultFontDownloadedEventSubscribers.forEach((sub) => {
      sub();
    });
  }

  private async downloadModel(modelSource: string) {
    const gltfLoader = new GLTFLoader();
    return new Promise<THREE.Group>((resolve) => {
      gltfLoader.load(modelSource, function (gltf) {
        gltf.scene.traverse((node) => {
          if (node instanceof THREE.Mesh) {
            const nextNode = node as THREE.Mesh;
            nextNode.castShadow = true;
            nextNode.receiveShadow = true;
            nextNode.frustumCulled = true;
          }
        });
        resolve(gltf.scene);
      });
    });
  }

  private async downloadPlayerModel() {
    this.playerModel = await this.downloadModel(CHARACTER_MODEL_SRC);

    this.playerModelDownloadedEventSubscribers.forEach((sub) => {
      sub();
    });
  }

  public subscribeItemModelsDownloadedEvent(subscriber: ItemModelsDownloadedEventSubscriber): () => void {
    this.itemModelsDownloadedEventSubscribers.push(subscriber);

    return () => {
      this.itemModelsDownloadedEventSubscribers.filter((_subscriber) => _subscriber !== subscriber);
    };
  }

  public subscribeDefaultFontDownloadedEvent(subscriber: DefaultFontDownloadedEventSubscriber): () => void {
    this.defaultFontDownloadedEventSubscribers.push(subscriber);

    return () => {
      this.defaultFontDownloadedEventSubscribers.filter((_subscriber) => _subscriber !== subscriber);
    };
  }

  public subscribePlayerModelDownloadedEvent(subscriber: PlayerModelDownloadedEventSubscriber): () => void {
    this.playerModelDownloadedEventSubscribers.push(subscriber);

    return () => {
      this.playerModelDownloadedEventSubscribers.filter((_subscriber) => _subscriber !== subscriber);
    };
  }

  public async downloadItemModels(item: ItemModel): Promise<void> {
    const itemId = item.getId();
    const currentItemModels = this.itemModelsMap[item.getId()];
    if (currentItemModels) return;

    const itemModelSources = item.getModelSources();

    const itemModels = await Promise.all(itemModelSources.map(this.downloadModel));

    this.itemModelsMap[itemId] = itemModels;

    this.itemModelsDownloadedEventSubscribers.forEach((sub) => {
      sub(itemId);
    });
  }

  public printRendererInfomation(): void {
    console.log(`Render Information: ${JSON.stringify(this.renderer.info.render)}`);
  }

  private updateCameraAspect(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  private updateRendererSize(width: number, height: number) {
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(2);
  }

  public updateCanvasSize(width: number, height: number) {
    this.updateCameraAspect(width, height);
    this.updateRendererSize(width, height);
  }

  public updateCameraPosition(perspectiveDepth: number, targetPrecisePos: PrecisePositionVo) {
    const CAMERA_Y_OFFSET = perspectiveDepth * Math.sin((45 / 360) * 2 * Math.PI);
    const CAMERA_Z_OFFSET = perspectiveDepth * Math.cos((45 / 360) * 2 * Math.PI);

    const [targetPrecisePosX, targetPrecisePosZ] = [targetPrecisePos.getX(), targetPrecisePos.getZ()];
    this.camera.position.set(targetPrecisePosX, CAMERA_Y_OFFSET, targetPrecisePosZ + CAMERA_Z_OFFSET);
    this.camera.lookAt(targetPrecisePosX, 0, targetPrecisePosZ);
  }

  private createScene() {
    const newScene = new THREE.Scene();
    newScene.background = new THREE.Color(0x87ceeb);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
    hemiLight.position.set(0, HEMI_LIGHT_HEIGHT, 0);
    newScene.add(hemiLight);

    return newScene;
  }

  private createCamera(): THREE.PerspectiveCamera {
    return new THREE.PerspectiveCamera(CAMERA_FOV, 1, 0.1, 1000);
  }

  private async createBase(worldBound: BoundVo) {
    const baseModel = await this.downloadModel(BASE_MODEL_SRC);

    const boundOffsetX = worldBound.getFrom().getX();
    const boundOffsetZ = worldBound.getFrom().getZ();
    const worldBoundWidth = worldBound.getWidth();
    const worldBoundHeight = worldBound.getHeight();
    const grassInstanceStates: { x: number; y: number; z: number; rotate: number }[] = [];
    rangeMatrix(worldBoundWidth, worldBoundHeight, (colIdx, rowIdx) => {
      grassInstanceStates.push({
        x: boundOffsetX + colIdx,
        y: 0,
        z: boundOffsetZ + rowIdx,
        rotate: 0,
      });
    });
    const removeInstancesFromScene = createInstancesInScene(this.scene, baseModel, grassInstanceStates);
    this.baseModelInstancesCleaner = removeInstancesFromScene;
  }

  private createGrid(worldBound: BoundVo) {
    const material = new THREE.LineBasicMaterial({ color: 0xdddddd, opacity: 0.2, transparent: true });
    const offsetX = worldBound.getFrom().getX() - 0.5;
    const offsetZ = worldBound.getFrom().getZ() - 0.5;
    const boundWidth = worldBound.getWidth();
    const boundheight = worldBound.getHeight();
    const grid = new THREE.Group();
    for (let x = 0; x <= boundWidth; x += 1) {
      const points: THREE.Vector3[] = [
        new THREE.Vector3(x + offsetX, 0, offsetZ),
        new THREE.Vector3(x + offsetX, 0, offsetZ + boundheight),
      ];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      grid.add(new THREE.Line(geometry, material));
    }
    for (let z = 0; z <= boundheight; z += 1) {
      const points: THREE.Vector3[] = [
        new THREE.Vector3(offsetX, 0, z + offsetZ),
        new THREE.Vector3(offsetX + boundWidth, 0, z + offsetZ),
      ];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      grid.add(new THREE.Line(geometry, material));
    }
    grid.position.set(0, 0.1, 0);

    this.scene.add(grid);
  }

  private createDirectionalLight(): THREE.DirectionalLight {
    const newDirLight = new THREE.DirectionalLight(0xffffff, 1);
    newDirLight.castShadow = true;
    newDirLight.position.set(-10, DIR_LIGHT_HEIGHT, DIR_LIGHT_Z_OFFSET);
    newDirLight.target.position.set(0, 0, 0);
    newDirLight.shadow.mapSize.set(4096, 4096);
    newDirLight.shadow.camera = new THREE.OrthographicCamera(-100, 100, 100, -100, 0.5, 500);

    return newDirLight;
  }

  private createRenderer(): THREE.WebGLRenderer {
    const newRenderer = new THREE.WebGLRenderer({ antialias: true });
    newRenderer.shadowMap.enabled = true;
    newRenderer.shadowMap.type = THREE.PCFSoftShadowMap;
    return newRenderer;
  }

  private updateFenceUnits(item: ItemModel, units: UnitModel[], getUnit: (position: PositionVo) => UnitModel | null) {
    const itemId = item.getId();

    const itemModels = this.itemModelsMap[itemId];
    if (!itemModels) return;

    this.itemModelInstancesCleanerMap[itemId]?.();

    const unitInstancesByModel: Record<0 | 1 | 2 | 3, InstanceState[]> = {
      0: [],
      1: [],
      2: [],
      3: [],
    };
    units.forEach((unit) => {
      const unitPosition = unit.getPosition();
      const sameAdjacentUnitFlags = [
        getUnit(unitPosition.getBottomPosition())?.getItemId() === itemId,
        getUnit(unitPosition.getRightPosition())?.getItemId() === itemId,
        getUnit(unitPosition.getTopPosition())?.getItemId() === itemId,
        getUnit(unitPosition.getLeftPosition())?.getItemId() === itemId,
      ];
      const sameAdjacentUnitCount = sameAdjacentUnitFlags.filter((flag) => flag).length;
      let modelIndex: 0 | 1 | 2 | 3 = 0;
      let unitDirection = DirectionVo.new(0);
      if (sameAdjacentUnitCount === 4) {
        modelIndex = 3;
        unitDirection = DirectionVo.new(0);
      } else if (sameAdjacentUnitCount === 3) {
        modelIndex = 2;
        unitDirection = DirectionVo.new((sameAdjacentUnitFlags.findIndex((flag) => !flag) || 0) + 1);
      } else if (sameAdjacentUnitCount === 2) {
        if (
          sameAdjacentUnitFlags[0] === sameAdjacentUnitFlags[1] ||
          sameAdjacentUnitFlags[1] === sameAdjacentUnitFlags[2]
        ) {
          modelIndex = 1;
          if (sameAdjacentUnitFlags[0] && sameAdjacentUnitFlags[1]) {
            unitDirection = DirectionVo.new(0);
          } else if (sameAdjacentUnitFlags[1] && sameAdjacentUnitFlags[2]) {
            unitDirection = DirectionVo.new(1);
          } else if (sameAdjacentUnitFlags[2] && sameAdjacentUnitFlags[3]) {
            unitDirection = DirectionVo.new(2);
          } else if (sameAdjacentUnitFlags[3] && sameAdjacentUnitFlags[0]) {
            unitDirection = DirectionVo.new(3);
          }
        } else {
          modelIndex = 0;
          unitDirection = DirectionVo.new(sameAdjacentUnitFlags.findIndex((flag) => !flag) || 0);
        }
      } else if (sameAdjacentUnitCount === 1) {
        modelIndex = 0;
        unitDirection = DirectionVo.new((sameAdjacentUnitFlags.findIndex((flag) => flag) || 0) + 1);
      } else {
        modelIndex = 0;
        unitDirection = unit.getDirection();
      }

      unitInstancesByModel[modelIndex].push({
        x: unit.getPosition().getX(),
        y: 0,
        z: unit.getPosition().getZ(),
        rotate: (Math.PI / 2) * (unitDirection ? unitDirection.toNumber() : unit.getDirection().toNumber()),
      });
    });

    const cleaners: (() => void)[] = [];
    cleaners.push(createInstancesInScene(this.scene, itemModels[0], unitInstancesByModel[0]));
    cleaners.push(createInstancesInScene(this.scene, itemModels[1], unitInstancesByModel[1]));
    cleaners.push(createInstancesInScene(this.scene, itemModels[2], unitInstancesByModel[2]));
    cleaners.push(createInstancesInScene(this.scene, itemModels[3], unitInstancesByModel[3]));

    this.itemModelInstancesCleanerMap[itemId] = () => {
      cleaners.forEach((cleaner) => {
        cleaner();
      });
    };
  }

  private updateLinkUnits(item: ItemModel, units: UnitModel[], font: Font) {
    const itemId = item.getId();

    const itemModels = this.itemModelsMap[itemId];
    if (!itemModels) return;

    this.itemModelInstancesCleanerMap[itemId]?.();

    const itemUnitInstanceStates = units.map((unit) => ({
      x: unit.getPosition().getX(),
      y: 0,
      z: unit.getPosition().getZ(),
      rotate: (Math.PI / 2) * unit.getDirection().toNumber(),
    }));

    const linkUnitTexts = units.map((unit) => {
      const textMesh = createTextMesh(
        font,
        unit.getLabel() ?? 'Link',
        unit.getPosition().getX(),
        3,
        unit.getPosition().getZ()
      );
      this.scene.add(textMesh);

      return textMesh;
    });

    const removeInstancesFromScene = createInstancesInScene(this.scene, itemModels[0], itemUnitInstanceStates);
    this.itemModelInstancesCleanerMap[itemId] = () => {
      linkUnitTexts.forEach((linkUnitText) => {
        this.scene.remove(linkUnitText);
      });
      removeInstancesFromScene();
    };
  }

  private updateOtherUnits(item: ItemModel, units: UnitModel[]) {
    const itemId = item.getId();

    const itemModels = this.itemModelsMap[itemId];
    if (!itemModels) return;

    this.itemModelInstancesCleanerMap[itemId]?.();

    const itemUnitInstanceStates = units.map((unit) => ({
      x: unit.getPosition().getX(),
      y: 0,
      z: unit.getPosition().getZ(),
      rotate: (Math.PI / 2) * unit.getDirection().toNumber(),
    }));
    const removeInstancesFromScene = createInstancesInScene(this.scene, itemModels[0], itemUnitInstanceStates);
    this.itemModelInstancesCleanerMap[itemId] = removeInstancesFromScene;
  }

  public updateUnitsOfItem(item: ItemModel, units: UnitModel[], getUnit: (position: PositionVo) => UnitModel | null) {
    const font = this.fontMap[DEFAULT_FONT_SRC];
    if (!font) return;

    const itemCompatibleUnitType = item.getCompatibleUnitType();
    if (itemCompatibleUnitType === UnitTypeEnum.Fence) {
      this.updateFenceUnits(item, units, getUnit);
    } else if (itemCompatibleUnitType === UnitTypeEnum.Link) {
      this.updateLinkUnits(item, units, font);
    } else {
      this.updateOtherUnits(item, units);
    }
  }

  public updatePlayers(players: PlayerModel[]): void {
    if (!this.playerModel) return;

    this.playerModelInstancesCleaner();
    const playerInstanceStates = players.map((player) => ({
      x: player.getPrecisePosition().getX(),
      y: 0,
      z: player.getPrecisePosition().getZ(),
      rotate: (player.getDirection().toNumber() * Math.PI) / 2,
    }));

    const removeInstancesFromScene = createInstancesInScene(this.scene, this.playerModel, playerInstanceStates);

    this.playerModelInstancesCleaner = removeInstancesFromScene;
  }

  public updatePlayerNames(players: PlayerModel[]): void {
    const font = this.fontMap[DEFAULT_FONT_SRC];
    if (!font) return;

    const playerIds = players.map((p) => p.getId());
    players.forEach((player) => {
      const playerId = player.getId();
      const existingPlayerNameMesh = this.existingPlayerNameFontMeshesMap[playerId];
      if (existingPlayerNameMesh) {
        existingPlayerNameMesh.position.set(
          player.getPrecisePosition().getX(),
          1.5,
          player.getPrecisePosition().getZ()
        );
        existingPlayerNameMesh.rotation.set(-Math.PI / 6, 0, 0);
      } else {
        const playerNameMesh = createTextMesh(
          font,
          player.getName(),
          player.getPosition().getX(),
          1.5,
          player.getPosition().getZ()
        );
        this.scene.add(playerNameMesh);
        this.existingPlayerNameFontMeshesMap[playerId] = playerNameMesh;
      }
    });
    const unusedPlayerNameMeshes = Object.entries(this.existingPlayerNameFontMeshesMap)
      .filter(([playerId]) => !playerIds.includes(playerId))
      .map(([, playerNameMesh]) => playerNameMesh);

    unusedPlayerNameMeshes.forEach((unusedPlayerNameMesh) => {
      this.scene.remove(unusedPlayerNameMesh);
    });
  }
}
