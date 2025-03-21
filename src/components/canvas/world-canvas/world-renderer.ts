import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Font, FontLoader } from 'three/examples/jsm/loaders/FontLoader';

import { ItemModel } from '@/models/world/item/item-model';
import { UnitModel } from '@/models/world/unit/unit-model';
import { PositionVo } from '@/models/world/common/position-vo';
import { PrecisePositionVo } from '@/models/world/common/precise-position-vo';
import { PlayerModel } from '@/models/world/player/player-model';
import { InstanceState, createInstancesInScene, createTextMesh } from './tjs-utils';
import { UnitTypeEnum } from '@/models/world/unit/unit-type-enum';
import { DirectionVo } from '@/models/world/common/direction-vo';
import { BlockModel } from '@/models/world/block/block-model';
import { ColorUnitModel } from '@/models/world/unit/color-unit-model';

const CAMERA_FOV = 50;
const HEMI_LIGHT_HEIGHT = 20;
const DIR_LIGHT_HEIGHT = 20;
const DIR_LIGHT_Z_OFFSET = 20;
const PLAYER_NAME_HEIGHT = 2;
const BASE_MODEL_SRC = '/assets/3d/scene/lawn.gltf';
const DEFAULT_FONT_SRC = 'https://cdn.jsdelivr.net/npm/three/examples/fonts/helvetiker_regular.typeface.json';
const CHARACTER_MODEL_SRC = '/characters/a-chiong.gltf';

type BaseModelDownloadedEventSubscriber = () => void;
type ItemModelsDownloadedEventSubscriber = (itemId: string) => void;
type DefaultFontDownloadedEventSubscriber = () => void;

export class WorldRenderer {
  private readonly scene: THREE.Scene;

  private camera: THREE.PerspectiveCamera;

  private readonly renderer: THREE.WebGLRenderer;

  private readonly directionalLight: THREE.DirectionalLight;

  private baseModel: THREE.Group | null = null;

  private baseModelDownloadedEventSubscribers: BaseModelDownloadedEventSubscriber[] = [];

  private itemModelsMap: Record<string, THREE.Group[] | undefined> = {};

  private fontMap: Record<string, Font | undefined> = {};

  private defaultFontDownloadedEventSubscribers: DefaultFontDownloadedEventSubscriber[] = [];

  private existingPlayerNameFontMeshesMap: Record<string, THREE.Mesh> = {};

  private itemModelsDownloadedEventSubscribers: ItemModelsDownloadedEventSubscriber[] = [];

  private itemModelInstancesCleanerMap: Record<string, (() => void) | undefined> = {};

  private baseModelInstancesCleaner: () => void = () => {};

  private gridCleaner: () => void = () => {};

  private playerInstancesMap: Map<string, [character: THREE.Group, name: THREE.Mesh]> = new Map();

  private playerModel: THREE.Group | null = null;

  constructor() {
    this.scene = this.createScene();

    this.camera = this.createCamera();

    this.directionalLight = this.createDirectionalLight();
    this.scene.add(this.directionalLight);
    this.scene.add(this.directionalLight.target);

    this.renderer = this.createRenderer();

    this.downloadDefaultFont(DEFAULT_FONT_SRC);
    this.downloadBaseModel();
    this.downloadPlayerModel();
  }

  static create() {
    return new WorldRenderer();
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

  private async downloadBaseModel() {
    this.baseModel = await this.downloadModel(BASE_MODEL_SRC);
    this.baseModelDownloadedEventSubscribers.forEach((sub) => sub());
  }

  private async downloadPlayerModel() {
    this.playerModel = await this.downloadModel(CHARACTER_MODEL_SRC);
  }

  public subscribeBaseModelsDownloadedEvent(subscriber: BaseModelDownloadedEventSubscriber): () => void {
    this.baseModelDownloadedEventSubscribers.push(subscriber);

    return () => {
      this.baseModelDownloadedEventSubscribers.filter((_subscriber) => _subscriber !== subscriber);
    };
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
    const CAMERA_Y_OFFSET = perspectiveDepth * Math.sin((38 / 360) * 2 * Math.PI);
    const CAMERA_Z_OFFSET = perspectiveDepth * Math.cos((38 / 360) * 2 * Math.PI);

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

  public async updateBase(blocks: BlockModel[]) {
    const baseModel = await this.downloadModel(BASE_MODEL_SRC);

    const grassInstanceStates: { x: number; y: number; z: number; rotate: number }[] = [];
    blocks.forEach((block) => {
      block.iterate((position) => {
        grassInstanceStates.push({
          x: position.getX(),
          y: 0,
          z: position.getZ(),
          rotate: 0,
        });
      });
    });
    const removeInstancesFromScene = createInstancesInScene(this.scene, baseModel, grassInstanceStates);
    this.baseModelInstancesCleaner = removeInstancesFromScene;
  }

  public updateGrid(blocks: BlockModel[]) {
    this.gridCleaner();

    const material = new THREE.LineBasicMaterial({ color: 0xdddddd, opacity: 0.2, transparent: true });

    const grids: THREE.Group<THREE.Object3DEventMap>[] = [];

    blocks.forEach((block) => {
      const blockBound = block.getBound();
      const offsetX = blockBound.getFrom().getX() - 0.5;
      const offsetZ = blockBound.getFrom().getZ() - 0.5;
      const boundWidth = blockBound.getWidth();
      const boundHeight = blockBound.getDepth();
      const grid = new THREE.Group();
      for (let x = 0; x <= boundWidth; x += 1) {
        const points: THREE.Vector3[] = [
          new THREE.Vector3(x + offsetX, 0, offsetZ),
          new THREE.Vector3(x + offsetX, 0, offsetZ + boundHeight),
        ];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        grid.add(new THREE.Line(geometry, material));
      }
      for (let z = 0; z <= boundHeight; z += 1) {
        const points: THREE.Vector3[] = [
          new THREE.Vector3(offsetX, 0, z + offsetZ),
          new THREE.Vector3(offsetX + boundWidth, 0, z + offsetZ),
        ];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        grid.add(new THREE.Line(geometry, material));
      }
      grid.position.set(0, 0.1, 0);
      grids.push(grid);
    });

    grids.forEach((grid) => {
      this.scene.add(grid);
    });

    this.gridCleaner = () => {
      grids.forEach((grid) => {
        this.scene.remove(grid);
      });
    };
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
      let unitDirection = DirectionVo.create(0);
      if (sameAdjacentUnitCount === 4) {
        modelIndex = 3;
        unitDirection = DirectionVo.create(0);
      } else if (sameAdjacentUnitCount === 3) {
        modelIndex = 2;
        unitDirection = DirectionVo.create((sameAdjacentUnitFlags.findIndex((flag) => !flag) || 0) + 1);
      } else if (sameAdjacentUnitCount === 2) {
        if (sameAdjacentUnitFlags[0] === sameAdjacentUnitFlags[1] || sameAdjacentUnitFlags[1] === sameAdjacentUnitFlags[2]) {
          modelIndex = 1;
          if (sameAdjacentUnitFlags[0] && sameAdjacentUnitFlags[1]) {
            unitDirection = DirectionVo.create(0);
          } else if (sameAdjacentUnitFlags[1] && sameAdjacentUnitFlags[2]) {
            unitDirection = DirectionVo.create(1);
          } else if (sameAdjacentUnitFlags[2] && sameAdjacentUnitFlags[3]) {
            unitDirection = DirectionVo.create(2);
          } else if (sameAdjacentUnitFlags[3] && sameAdjacentUnitFlags[0]) {
            unitDirection = DirectionVo.create(3);
          }
        } else {
          modelIndex = 0;
          unitDirection = DirectionVo.create(sameAdjacentUnitFlags.findIndex((flag) => !flag) || 0);
        }
      } else if (sameAdjacentUnitCount === 1) {
        modelIndex = 0;
        unitDirection = DirectionVo.create((sameAdjacentUnitFlags.findIndex((flag) => flag) || 0) + 1);
      } else {
        modelIndex = 0;
        unitDirection = unit.getDirection();
      }

      unitInstancesByModel[modelIndex].push({
        x: unit.getCenterPrecisePosition().getX(),
        y: 0,
        z: unit.getCenterPrecisePosition().getZ(),
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
      x: unit.getCenterPrecisePosition().getX(),
      y: 0,
      z: unit.getCenterPrecisePosition().getZ(),
      rotate: (Math.PI / 2) * unit.getDirection().toNumber(),
    }));

    const linkUnitTexts = units.map((unit) => {
      const textMesh = createTextMesh(
        font,
        unit.getLabel() ?? 'Link',
        unit.getCenterPrecisePosition().getX(),
        1.5,
        unit.getCenterPrecisePosition().getZ()
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

  private updateEmbedUnits(item: ItemModel, units: UnitModel[], font: Font) {
    const itemId = item.getId();

    const itemModels = this.itemModelsMap[itemId];
    if (!itemModels) return;

    this.itemModelInstancesCleanerMap[itemId]?.();

    const itemUnitInstanceStates = units.map((unit) => ({
      x: unit.getCenterPrecisePosition().getX(),
      y: 0,
      z: unit.getCenterPrecisePosition().getZ(),
      rotate: (Math.PI / 2) * unit.getDirection().toNumber(),
    }));

    const unitLabels = units.map((unit) => {
      const textMesh = createTextMesh(
        font,
        unit.getLabel() ?? 'Link',
        unit.getCenterPrecisePosition().getX(),
        1.5,
        unit.getCenterPrecisePosition().getZ()
      );
      this.scene.add(textMesh);

      return textMesh;
    });

    const removeInstancesFromScene = createInstancesInScene(this.scene, itemModels[0], itemUnitInstanceStates);
    this.itemModelInstancesCleanerMap[itemId] = () => {
      unitLabels.forEach((unitLabel) => {
        this.scene.remove(unitLabel);
      });
      removeInstancesFromScene();
    };
  }

  private updateColorUnits(item: ItemModel, units: UnitModel[]) {
    const itemId = item.getId();

    const itemModels = this.itemModelsMap[itemId];
    if (!itemModels) return;

    this.itemModelInstancesCleanerMap[itemId]?.();

    const itemUnitInstanceStates: InstanceState[] = [];

    units.forEach((unit) => {
      if (!(unit instanceof ColorUnitModel)) return;

      itemUnitInstanceStates.push({
        x: unit.getCenterPrecisePosition().getX(),
        y: 0,
        z: unit.getCenterPrecisePosition().getZ(),
        rotate: (Math.PI / 2) * unit.getDirection().toNumber(),
        color: unit.getColor() ?? undefined,
      });
    });

    const removeInstancesFromScene = createInstancesInScene(this.scene, itemModels[0], itemUnitInstanceStates);
    this.itemModelInstancesCleanerMap[itemId] = () => {
      removeInstancesFromScene();
    };
  }

  private updateSignUnits(item: ItemModel, units: UnitModel[], font: Font) {
    const itemId = item.getId();

    const itemModels = this.itemModelsMap[itemId];
    if (!itemModels) return;

    this.itemModelInstancesCleanerMap[itemId]?.();

    const itemUnitInstanceStates = units.map((unit) => ({
      x: unit.getCenterPrecisePosition().getX(),
      y: 0,
      z: unit.getCenterPrecisePosition().getZ(),
      rotate: (Math.PI / 2) * unit.getDirection().toNumber(),
    }));

    const unitLabels = units.map((unit) => {
      const textMesh = createTextMesh(
        font,
        unit.getLabel() ?? 'Link',
        unit.getCenterPrecisePosition().getX(),
        1.5,
        unit.getCenterPrecisePosition().getZ()
      );
      this.scene.add(textMesh);

      return textMesh;
    });

    const removeInstancesFromScene = createInstancesInScene(this.scene, itemModels[0], itemUnitInstanceStates);
    this.itemModelInstancesCleanerMap[itemId] = () => {
      unitLabels.forEach((unitLabel) => {
        this.scene.remove(unitLabel);
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
      x: unit.getCenterPrecisePosition().getX(),
      y: 0,
      z: unit.getCenterPrecisePosition().getZ(),
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
    } else if (itemCompatibleUnitType === UnitTypeEnum.Embed) {
      this.updateEmbedUnits(item, units, font);
    } else if (itemCompatibleUnitType === UnitTypeEnum.Color) {
      this.updateColorUnits(item, units);
    } else if (itemCompatibleUnitType === UnitTypeEnum.Sign) {
      this.updateSignUnits(item, units, font);
    } else {
      this.updateOtherUnits(item, units);
    }
  }

  public updatePlayer(player: PlayerModel): void {
    const font = this.fontMap[DEFAULT_FONT_SRC];
    if (!font) return;

    if (!this.playerModel) return;

    const playerId = player.getId();

    const playerInstances = this.playerInstancesMap.get(playerId);
    if (playerInstances) {
      const [playerCharacterInstance, playerNameInstance] = playerInstances;
      playerCharacterInstance.position.set(player.getPrecisePosition().getX(), 0, player.getPrecisePosition().getZ());
      playerCharacterInstance.rotation.set(0, (player.getDirection().toNumber() * Math.PI) / 2, 0);

      playerNameInstance.position.set(player.getPrecisePosition().getX(), PLAYER_NAME_HEIGHT, player.getPrecisePosition().getZ());
    } else {
      const newPlayerInstance = this.playerModel.clone();
      newPlayerInstance.position.set(player.getPrecisePosition().getX(), 0, player.getPrecisePosition().getZ());
      newPlayerInstance.rotation.set(0, (player.getDirection().toNumber() * Math.PI) / 2, 0);
      this.scene.add(newPlayerInstance);

      const newPlayerNameInstance = createTextMesh(
        font,
        player.getName(),
        player.getPrecisePosition().getX(),
        PLAYER_NAME_HEIGHT,
        player.getPrecisePosition().getZ()
      );
      this.scene.add(newPlayerNameInstance);

      this.playerInstancesMap.set(playerId, [newPlayerInstance, newPlayerNameInstance]);
    }
  }

  public removePlayer(player: PlayerModel): void {
    const playerId = player.getId();
    const playerInstances = this.playerInstancesMap.get(playerId);
    if (!playerInstances) return;

    const [playerCharacterInstance, playerNameInstance] = playerInstances;
    this.scene.remove(playerCharacterInstance);
    this.scene.remove(playerNameInstance);
  }
}
