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
import { BoundVo } from '@/models/world/common/bound-vo';
import { EventHandler, EventHandlerSubscriber } from '@/event-dispatchers/common/event-handler';
import { DimensionVo } from '@/models/world/common/dimension-vo';
import { calculateExpectedUnitBound } from '@/models/world/common/utils';
import { ColorVo } from '@/models/world/common/color-vo';

const CAMERA_FOV = 50;
const HEMI_LIGHT_HEIGHT = 20;
const DIR_LIGHT_HEIGHT = 20;
const DIR_LIGHT_Z_OFFSET = 20;
const PLAYER_NAME_HEIGHT = 2;
const PIXEL_RATIO = 2;
const SKY_COLOR = 0x4682b4;
const GRID_COLOR = 0x90ee90;
const GROUND_COLOR = ColorVo.create(135, 225, 245);
const BASE_MODEL_SRC = '/assets/3d/scene/lawn.gltf';
const DEFAULT_FONT_SRC = 'https://cdn.jsdelivr.net/npm/three/examples/fonts/droid/droid_sans_regular.typeface.json';
const CHARACTER_MODEL_SRC = '/characters/a-chiong.gltf';
const HOVER_INDICATOR_COLOR_GREEN = 0x00ff00;
const HOVER_INDICATOR_COLOR_RED = 0xff0000;

export class WorldRenderer {
  private readonly scene: THREE.Scene;

  private camera: THREE.PerspectiveCamera;

  private readonly renderer: THREE.WebGLRenderer;

  private readonly directionalLight: THREE.DirectionalLight;

  private baseModel: THREE.Group | null = null;

  private baseModelDownloadedEventSubscribers = EventHandler.create<void>();

  private itemModelsMap: Record<string, THREE.Group[] | undefined> = {};

  private fontMap: Record<string, Font | undefined> = {};

  private defaultFontDownloadedEventSubscribers = EventHandler.create<void>();

  private existingPlayerNameFontMeshesMap: Record<string, THREE.Mesh> = {};

  private itemModelsDownloadedEventSubscribers = EventHandler.create<string>();

  private itemModelInstancesCleanerMap: Record<string, (() => void) | undefined> = {};

  private baseModelInstancesCleaner: () => void = () => {};

  private gridCleaner: () => void = () => {};

  private playerInstancesMap: Map<string, [character: THREE.Group, name: THREE.Mesh]> = new Map();

  private playerModel: THREE.Group | null = null;

  private playerModelDownloadedEventSubscribers = EventHandler.create<void>();

  private mouseClientPosition: { x: number; y: number } = { x: 0, y: 0 };

  private selectedBoundIndicator: THREE.Mesh;

  private touchPanel: THREE.Mesh;

  private draggedItemModel: THREE.Group | null = null;

  private draggedPosition: PositionVo | null = null;

  private selectedItemModel: THREE.Group | null = null;

  private positionDragStartEventHandler = EventHandler.create<PositionVo>();

  private positionDragEndEventHandler = EventHandler.create<PositionVo>();

  private positionDragCancelEventHandler = EventHandler.create<void>();

  private positionClickEventHandler = EventHandler.create<PositionVo>();

  private positionHoverEventHandler = EventHandler.create<PositionVo>();

  private positionHoverIndicator: THREE.Mesh;

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

    this.selectedBoundIndicator = new THREE.Mesh(
      new THREE.BoxGeometry(1, 2, 1),
      new THREE.MeshBasicMaterial({ color: 0x00ff00, opacity: 0.5, transparent: true })
    );
    this.selectedBoundIndicator.position.set(0, -100, 0);
    this.scene.add(this.selectedBoundIndicator);

    this.positionHoverIndicator = new THREE.Mesh(
      new THREE.BoxGeometry(1, 0.1, 1),
      new THREE.MeshBasicMaterial({ color: HOVER_INDICATOR_COLOR_GREEN, opacity: 0.5, transparent: true })
    );
    this.positionHoverIndicator.position.set(0, -100, 0);
    this.scene.add(this.positionHoverIndicator);

    this.touchPanel = new THREE.Mesh(
      new THREE.BoxGeometry(100, 1, 100),
      new THREE.MeshBasicMaterial({ color: 0x000000, opacity: 0, transparent: true })
    );
    this.touchPanel.position.set(0, -0.5, 0);

    this.scene.add(this.touchPanel);
  }

  static create() {
    return new WorldRenderer();
  }

  public render() {
    this.renderer.render(this.scene, this.camera);
  }

  public mount(element: HTMLElement) {
    element.appendChild(this.renderer.domElement);

    element.addEventListener('mousedown', this.handlePositionMouseDown.bind(this));
    window.addEventListener('mouseup', this.handlePositionMouseUp.bind(this));
    window.addEventListener('mousemove', this.handlePositionMouseMove.bind(this));
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

    element.removeEventListener('mousedown', this.handlePositionMouseDown.bind(this));
    window.removeEventListener('mouseup', this.handlePositionMouseUp.bind(this));
    window.removeEventListener('mousemove', this.handlePositionMouseMove.bind(this));
    element.removeChild(this.renderer.domElement);
  }

  private getMousePosition(mousePosition: { x: number; y: number }): PositionVo | null {
    const x = (mousePosition.x / this.renderer.domElement.clientWidth) * 2 - 1;
    const y = -(mousePosition.y / this.renderer.domElement.clientHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);
    const intersect = raycaster.intersectObjects([this.touchPanel])[0];
    if (intersect) {
      return PositionVo.create(Math.round(intersect.point.x), Math.round(intersect.point.z));
    }
    return null;
  }

  private handlePositionMouseDown(event: MouseEvent) {
    const position = this.getMousePosition({ x: event.clientX, y: event.clientY });
    if (position) {
      this.draggedPosition = position;
      this.positionDragStartEventHandler.publish(position);
    }
  }

  private handlePositionMouseUp(event: MouseEvent) {
    if (event.target !== this.renderer.domElement) {
      if (this.draggedPosition) {
        this.positionDragCancelEventHandler.publish();
        this.draggedPosition = null;
      }
      return;
    }

    const position = this.getMousePosition({ x: event.clientX, y: event.clientY });
    if (position) {
      if (this.draggedPosition) {
        if (this.draggedPosition.isEqual(position)) {
          this.positionClickEventHandler.publish(position);
          this.positionDragCancelEventHandler.publish();
        } else {
          this.positionDragEndEventHandler.publish(position);
        }
      }
    }
    this.draggedPosition = null;
  }

  private handlePositionMouseMove(event: MouseEvent) {
    this.mouseClientPosition = { x: event.clientX, y: event.clientY };

    const position = this.getMousePosition(this.mouseClientPosition);
    if (position) {
      this.positionHoverEventHandler.publish(position);
    }
  }

  public updateHoverIndicatorColor(color: 'green' | 'red') {
    if (this.positionHoverIndicator.material instanceof THREE.MeshBasicMaterial) {
      this.positionHoverIndicator.material.color.set(color === 'green' ? HOVER_INDICATOR_COLOR_GREEN : HOVER_INDICATOR_COLOR_RED);
    }
  }

  public updateHoverIndicatorPosition(position: PositionVo) {
    this.positionHoverIndicator.position.set(position.getX(), 0, position.getZ());
    this.positionHoverIndicator.scale.set(1, 1, 1);
  }

  public subscribePositionDragStartEvent(subscriber: EventHandlerSubscriber<PositionVo>): () => void {
    return this.positionDragStartEventHandler.subscribe(subscriber);
  }

  public subscribePositionDragEndEvent(subscriber: EventHandlerSubscriber<PositionVo>): () => void {
    return this.positionDragEndEventHandler.subscribe(subscriber);
  }

  public subscribePositionDragCancelEvent(subscriber: EventHandlerSubscriber<void>): () => void {
    return this.positionDragCancelEventHandler.subscribe(subscriber);
  }

  public subscribePositionHoverEvent(subscriber: EventHandlerSubscriber<PositionVo>): () => void {
    return this.positionHoverEventHandler.subscribe(subscriber);
  }

  public subscribePositionClickEvent(subscriber: EventHandlerSubscriber<PositionVo>): () => void {
    return this.positionClickEventHandler.subscribe(subscriber);
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

    this.defaultFontDownloadedEventSubscribers.publish();
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
    this.baseModelDownloadedEventSubscribers.publish();
  }

  private async downloadPlayerModel() {
    this.playerModel = await this.downloadModel(CHARACTER_MODEL_SRC);
    this.playerModelDownloadedEventSubscribers.publish();
  }

  public subscribePlayerModelDownloadedEvent(subscriber: EventHandlerSubscriber<void>): () => void {
    return this.playerModelDownloadedEventSubscribers.subscribe(subscriber);
  }

  public subscribeBaseModelsDownloadedEvent(subscriber: EventHandlerSubscriber<void>): () => void {
    return this.baseModelDownloadedEventSubscribers.subscribe(subscriber);
  }

  public subscribeItemModelsDownloadedEvent(subscriber: EventHandlerSubscriber<string>): () => void {
    return this.itemModelsDownloadedEventSubscribers.subscribe(subscriber);
  }

  public subscribeDefaultFontDownloadedEvent(subscriber: EventHandlerSubscriber<void>): () => void {
    return this.defaultFontDownloadedEventSubscribers.subscribe(subscriber);
  }

  public async downloadItemModels(item: ItemModel): Promise<void> {
    const itemId = item.getId();
    const currentItemModels = this.itemModelsMap[item.getId()];
    if (currentItemModels) return;

    const itemModelSources = item.getModelSources();

    const itemModels = await Promise.all(itemModelSources.map(this.downloadModel));

    this.itemModelsMap[itemId] = itemModels;

    this.itemModelsDownloadedEventSubscribers.publish(itemId);
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
    this.renderer.setPixelRatio(PIXEL_RATIO);
  }

  public updateCanvasSize(width: number, height: number) {
    this.updateCameraAspect(width, height);
    this.updateRendererSize(width, height);
  }

  public updateCameraPosition(cameraPosition: PrecisePositionVo, targetPrecisePos: PrecisePositionVo) {
    this.camera.position.set(cameraPosition.getX(), cameraPosition.getY(), cameraPosition.getZ());
    this.camera.lookAt(targetPrecisePos.getX(), 0, targetPrecisePos.getZ());

    const position = this.getMousePosition(this.mouseClientPosition);
    if (position) {
      this.positionHoverEventHandler.publish(position);
    }
  }

  private createScene() {
    const newScene = new THREE.Scene();
    newScene.background = new THREE.Color(SKY_COLOR);

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

    const grassInstanceStates: { x: number; y: number; z: number; rotate: number; color: ColorVo }[] = [];
    blocks.forEach((block) => {
      block.iterate((position) => {
        grassInstanceStates.push({
          x: position.getX(),
          y: 0,
          z: position.getZ(),
          rotate: 0,
          color: GROUND_COLOR,
        });
      });
    });
    const removeInstancesFromScene = createInstancesInScene(this.scene, baseModel, grassInstanceStates);
    this.baseModelInstancesCleaner = removeInstancesFromScene;
  }

  public updateGrid(blocks: BlockModel[]) {
    this.gridCleaner();

    const material = new THREE.LineBasicMaterial({ color: GRID_COLOR, opacity: 0.3, transparent: true });

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
        const line = new THREE.Line(geometry, material);
        line.receiveShadow = false;
        line.castShadow = false;
        grid.add(line);
      }
      for (let z = 0; z <= boundHeight; z += 1) {
        const points: THREE.Vector3[] = [
          new THREE.Vector3(offsetX, 0, z + offsetZ),
          new THREE.Vector3(offsetX + boundWidth, 0, z + offsetZ),
        ];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, material);
        line.receiveShadow = false;
        line.castShadow = false;
        grid.add(line);
      }
      grid.position.set(0, 0.01, 0);
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
      if (unit.getType() !== UnitTypeEnum.Color) return;

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

  public updateTouchPanelPosition(position: PositionVo) {
    this.touchPanel.position.set(position.getX(), -0.5, position.getZ());
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

  public getCanvasPosition(position: PrecisePositionVo | PositionVo) {
    this.camera.updateProjectionMatrix();
    const vector = new THREE.Vector3(position.getX(), position.getY(), position.getZ());
    vector.project(this.camera);

    // Remember to divide by the pixel ratio
    const canvasWidth = this.renderer.domElement.width / PIXEL_RATIO;
    const canvasHeight = this.renderer.domElement.height / PIXEL_RATIO;

    const x = ((vector.x + 1) * canvasWidth) / 2;
    const y = -((vector.y - 1) * canvasHeight) / 2;

    return { x, y };
  }

  public updateSelectedBound(newSelectedBound: BoundVo | null) {
    if (newSelectedBound) {
      const center = newSelectedBound.getCenterPrecisePosition();
      this.selectedBoundIndicator.position.set(center.getX(), 0, center.getZ());
      this.selectedBoundIndicator.scale.set(newSelectedBound.getWidth() + 0.1, 1, newSelectedBound.getDepth() + 0.1);
    } else {
      this.selectedBoundIndicator.position.set(0, -100, 0);
    }
  }

  public addDraggedItem(item: ItemModel) {
    const draggedItemModels = this.itemModelsMap[item.getId()];
    if (!draggedItemModels) return;

    const draggedItemModel = draggedItemModels[0];
    if (!draggedItemModel) return;

    this.draggedItemModel = draggedItemModel.clone();
    this.draggedItemModel.position.set(0, -1000, 0);
    this.draggedItemModel.rotation.set(0, 0, 0);
    this.scene.add(this.draggedItemModel);
  }

  public updateDraggedItem(position: PositionVo, dimension: DimensionVo, direction: DirectionVo) {
    if (!this.draggedItemModel) return;

    const bound = calculateExpectedUnitBound(position, dimension, direction);
    const boundCenter = bound.getCenterPrecisePosition();
    this.draggedItemModel.position.set(boundCenter.getX(), 0, boundCenter.getZ());
    this.draggedItemModel.rotation.set(0, (direction.toNumber() * Math.PI) / 2, 0);

    this.positionHoverIndicator.position.set(boundCenter.getX(), 0, boundCenter.getZ());
    this.positionHoverIndicator.rotation.set(0, (direction.toNumber() * Math.PI) / 2, 0);
    this.positionHoverIndicator.scale.set(dimension.getWidth(), 1, dimension.getDepth());
  }

  public removeDraggedItem() {
    if (!this.draggedItemModel) return;

    this.scene.remove(this.draggedItemModel);
    this.draggedItemModel = null;
  }

  public addSelectedItem(item: ItemModel, position: PositionVo, direction: DirectionVo) {
    const selectedItemModels = this.itemModelsMap[item.getId()];
    if (!selectedItemModels) return;

    const [selectedItemModel] = selectedItemModels;
    if (!selectedItemModel) return;

    const bound = calculateExpectedUnitBound(position, item.getDimension(), direction);
    const boundCenter = bound.getCenterPrecisePosition();
    this.selectedItemModel = selectedItemModel.clone();
    this.selectedItemModel.position.set(boundCenter.getX(), 0, boundCenter.getZ());
    this.selectedItemModel.rotation.set(0, (direction.toNumber() * Math.PI) / 2, 0);
    this.scene.add(this.selectedItemModel);
  }

  public updateSelectedItem(item: ItemModel, position: PositionVo, direction: DirectionVo) {
    if (!this.selectedItemModel) return;

    const itemDimension = item.getDimension();
    const bound = calculateExpectedUnitBound(position, itemDimension, direction);
    const boundCenter = bound.getCenterPrecisePosition();
    this.selectedItemModel.position.set(boundCenter.getX(), 0, boundCenter.getZ());
    this.selectedItemModel.rotation.set(0, (direction.toNumber() * Math.PI) / 2, 0);

    this.positionHoverIndicator.position.set(boundCenter.getX(), 0, boundCenter.getZ());
    this.positionHoverIndicator.rotation.set(0, (direction.toNumber() * Math.PI) / 2, 0);
    this.positionHoverIndicator.scale.set(itemDimension.getWidth(), 1, itemDimension.getDepth());
  }

  public removeSelectedItem() {
    if (!this.selectedItemModel) return;

    this.scene.remove(this.selectedItemModel);
    this.selectedItemModel = null;
  }
}
