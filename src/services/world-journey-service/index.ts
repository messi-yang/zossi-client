import { ItemModel } from '@/models/world/item/item-model';
import { PlayerModel } from '@/models/world/player/player-model';
import { UnitModel } from '@/models/world/unit/unit-model';
import { WorldModel } from '@/models/world/world/world-model';
import { PositionVo } from '@/models/world/common/position-vo';

import { UnitManager } from './managers/unit-manager';
import { PlayerManager } from './managers/player-manager';
import { PerspectiveManager } from './managers/perspective-manager';
import { ItemManager } from './managers/item-manager';
import { SelectionManager } from './managers/selection-manager';
import { Command } from './managers/command-manager/command';
import { CommandManager } from './managers/command-manager';
import { ChangePlayerPrecisePositionCommand } from './managers/command-manager/commands/change-player-precise-position-command';
import { EventHandlerSubscriber, EventHandler } from '../../event-dispatchers/common/event-handler';
import { BlockModel } from '@/models/world/block/block-model';
import { BlockIdVo } from '@/models/world/block/block-id-vo';
import { PortalUnitModel } from '@/models/world/unit/portal-unit-model';
import { MoveUnitCommand } from './managers/command-manager/commands/move-unit-command';
import { ChangePlayerHeldItemCommand } from './managers/command-manager/commands/change-player-held-item-command';
import { DirectionVo } from '@/models/world/common/direction-vo';

export class WorldJourneyService {
  private world: WorldModel;

  private unitManager: UnitManager;

  private playerManager: PlayerManager;

  private itemManager: ItemManager;

  private commandManager: CommandManager;

  private perspectiveManager: PerspectiveManager;

  private selectionManager: SelectionManager;

  private animateId: number | null = null;

  private updatePlayerPositionTickFps;

  private updatePlayerPositionTickCount;

  private myPlayerEnteredPortalUnitEventHandler = EventHandler.create<PortalUnitModel>();

  constructor(world: WorldModel, players: PlayerModel[], myPlayerId: string, blocks: BlockModel[], units: UnitModel[]) {
    this.world = world;

    this.unitManager = UnitManager.create(blocks, units);

    this.playerManager = PlayerManager.create(players, myPlayerId);

    this.perspectiveManager = PerspectiveManager.create();

    this.itemManager = ItemManager.create();

    this.commandManager = CommandManager.create(world, this.playerManager, this.unitManager, this.itemManager, this.perspectiveManager);

    this.selectionManager = SelectionManager.create(this.unitManager, this.itemManager, this.playerManager);

    this.updatePlayerPositionTickFps = 24;
    this.updatePlayerPositionTickCount = 0;
    this.updatePlayerPositionTicker();

    this.updateMyPlayerNearBlocksTicker();

    this.checkMyPlayerWalkIntoPortalTicker();

    this.selectionManager.subscribeSelectedItemAdded(({ item }) => {
      this.commandManager.executeLocalCommand(ChangePlayerHeldItemCommand.create(this.getMyPlayer().getId(), item.getId()));
    });

    this.selectionManager.subscribeSelectedItemRemoved(() => {
      this.commandManager.executeLocalCommand(ChangePlayerHeldItemCommand.create(this.getMyPlayer().getId(), null));
    });
  }

  public destroy() {
    if (this.animateId !== null) {
      cancelAnimationFrame(this.animateId);
    }
  }

  static create(world: WorldModel, players: PlayerModel[], myPlayerId: string, blocks: BlockModel[], units: UnitModel[]) {
    return new WorldJourneyService(world, players, myPlayerId, blocks, units);
  }

  public removeFailedCommand(commandId: string) {
    this.commandManager.removeFailedCommand(commandId);
  }

  /**
   * Replays commands executed within the specified duration.
   * @param duration miliseconds
   * @param speed 1 is normal speed
   */
  public replayCommands(duration: number, speed: number) {
    this.commandManager.replayCommands(duration, speed);
  }

  public executeRemoteCommand(command: Command) {
    this.commandManager.executeRemoteCommand(command);
  }

  public executeLocalCommand(command: Command) {
    this.commandManager.executeLocalCommand(command);
  }

  public getCameraPosition(): PositionVo {
    return this.perspectiveManager.getCameraPosition();
  }

  public updateCameraPosition() {
    this.perspectiveManager.updateCameraPosition();
  }

  public getWorld(): WorldModel {
    return this.world;
  }

  public getMyPlayerHeldItem(): ItemModel | null {
    const myPlayerHeldItemId = this.getMyPlayer().getHeldItemId();
    if (!myPlayerHeldItemId) return null;

    return this.getItem(myPlayerHeldItemId) || null;
  }

  public isMyPlayer(player: PlayerModel): boolean {
    return player.getId() === this.playerManager.getMyPlayerId();
  }

  public getMyPlayer(): PlayerModel {
    return this.playerManager.getMyPlayer();
  }

  public getPlayers(): PlayerModel[] {
    return this.playerManager.getPlayers();
  }

  public getOtherPlayers(): PlayerModel[] {
    return this.playerManager.getOtherPlayers();
  }

  public doesPosHavePlayers(pos: PositionVo): boolean {
    return !!this.playerManager.getPlayersAtPos(pos);
  }

  public getBlocks(): BlockModel[] {
    return this.unitManager.getBlocks();
  }

  public addBlock(block: BlockModel): void {
    this.unitManager.addBlock(block);
  }

  public getUnit(unitId: string): UnitModel | null {
    return this.unitManager.getUnit(unitId);
  }

  public getUnitByPos(position: PositionVo) {
    return this.unitManager.getUnitByPos(position);
  }

  public addUnit(unit: UnitModel): void {
    this.unitManager.addUnit(unit);
  }

  public addUnits(units: UnitModel[]): void {
    this.unitManager.addUnits(units);
  }

  public getUnitsOfItem(itemId: string): UnitModel[] {
    return this.unitManager.getUnitsByItemId(itemId);
  }

  /**
   * Get all units separated by item id
   */
  public getAllUnitsByItemId() {
    return this.unitManager.getAllUnitsByItemId();
  }

  /**
   * Load item
   */
  public loadItem(item: ItemModel) {
    this.itemManager.loadItem(item);
  }

  public getItem(itemId: string): ItemModel | null {
    return this.itemManager.getItem(itemId);
  }

  private checkMyPlayerWalkIntoPortalTicker() {
    this.subscribe('MY_PLAYER_POSITION_UPDATED', ([oldPlayerPos, newPlayerPos]) => {
      if (this.commandManager.getIsReplayingCommands()) return;

      const unitAtNewPlayerPos = this.unitManager.getUnitByPos(newPlayerPos);
      if (!unitAtNewPlayerPos) return;

      if (unitAtNewPlayerPos instanceof PortalUnitModel) {
        const unitAtOldPlayerPos = this.unitManager.getUnitByPos(oldPlayerPos);
        if (unitAtOldPlayerPos instanceof PortalUnitModel) return;

        // To prevent infinite teleporting loop, we need to check if we just came from another portal
        const myPlayer = this.playerManager.getMyPlayer();
        if (myPlayer.getAction().isTeleported()) return;

        this.myPlayerEnteredPortalUnitEventHandler.publish(unitAtNewPlayerPos);
      }
    });
  }

  private updateMyPlayerNearBlocksTicker() {
    this.subscribe('MY_PLAYER_UPDATED', ([, newPlayer]) => {
      if (this.commandManager.getIsReplayingCommands()) return;

      const worldId = this.world.getId();
      this.unitManager.addPlaceholderBlockIds(newPlayer.getNearBlockIds(worldId));
    });
  }

  private updatePlayerPosition() {
    this.updatePlayerPositionTickCount += 1;

    const myPlayer = this.playerManager.getMyPlayer();
    const myPlayerAction = myPlayer.getAction();
    if (myPlayerAction.isStand()) {
      if (this.updatePlayerPositionTickCount % 10 === 0) {
        this.executeLocalCommand(ChangePlayerPrecisePositionCommand.create(myPlayer.getId(), myPlayer.getPrecisePosition()));
      }
    } else if (myPlayerAction.isWalk()) {
      const myPlayerDirection = myPlayer.getDirection();
      const myPlayerPrecisePosition = myPlayer.getPrecisePosition();
      const myPlayerForwardPos = myPlayer.getFowardPosition(0.5);
      const unitAtPos = this.unitManager.getUnitByPos(myPlayerForwardPos);
      if (unitAtPos) {
        const item = this.itemManager.getItem(unitAtPos.getItemId());
        if (!item) return;
        if (!item.getTraversable()) return;
      }

      const nextMyPlayerPrecisePosition = myPlayerPrecisePosition.shiftByDirection(myPlayerDirection, 5 / this.updatePlayerPositionTickFps);

      this.executeLocalCommand(ChangePlayerPrecisePositionCommand.create(myPlayer.getId(), nextMyPlayerPrecisePosition));
    }
  }

  private updatePlayerPositionTicker() {
    const frameDelay = 1000 / this.updatePlayerPositionTickFps;
    let lastFrameTime = 0;

    const animate = () => {
      const currentTime = performance.now();
      const elapsed = currentTime - lastFrameTime;
      if (elapsed > frameDelay) {
        this.updatePlayerPosition();
        lastFrameTime = currentTime - (elapsed % frameDelay);
      }
      this.animateId = requestAnimationFrame(animate);
    };
    animate();
  }

  public resetSelection() {
    this.selectionManager.resetSelection();
  }

  public hoverPosition(position: PositionVo) {
    this.selectionManager.hoverPosition(position);
  }

  public getHoveredPosition(): PositionVo | null {
    return this.selectionManager.getHoveredPosition();
  }

  public getSelectedUnit(): UnitModel | null {
    const selectedUnitId = this.selectionManager.getSelectedUnitId();
    if (!selectedUnitId) return null;

    return this.unitManager.getUnit(selectedUnitId);
  }

  public selectUnit(unitId: string) {
    this.selectionManager.selectUnit(unitId);
  }

  public clearSelectedUnit() {
    this.selectionManager.clearSelectedUnit();
  }

  public getDraggedUnit(): UnitModel | null {
    return this.selectionManager.getDraggedUnit();
  }

  public dragUnit(unitId: string) {
    this.selectionManager.dragUnit(unitId);
  }

  public clearDraggedUnit() {
    this.selectionManager.clearDraggedUnit();
  }

  public getSelectedItem(): ItemModel | null {
    return this.selectionManager.getSelectedItem();
  }

  public getSelectedItemDirection(): DirectionVo | null {
    return this.selectionManager.getSelectedItemDirection();
  }

  public selectItem(itemId: string) {
    this.selectionManager.selectItem(itemId);
  }

  public rotateSelectedItem() {
    this.selectionManager.rotateSelectedItem();
  }

  public clearSelectedItem() {
    this.selectionManager.clearSelectedItem();
  }

  public moveUnit(unitId: string, position: PositionVo) {
    const unit = this.unitManager.getUnit(unitId);
    if (!unit) return;

    const command = MoveUnitCommand.create(
      unitId,
      unit.getType(),
      unit.getItemId(),
      position,
      unit.getDirection(),
      unit.getLabel(),
      unit.getColor()
    );

    this.commandManager.executeLocalCommand(command);
  }

  subscribe(eventName: 'LOCAL_COMMAND_EXECUTED', subscriber: EventHandlerSubscriber<Command>): () => void;
  subscribe(eventName: 'CAMERA_POSITION_UPDATED', subscriber: EventHandlerSubscriber<PositionVo>): () => void;
  subscribe(eventName: 'ITEM_ADDED', subscriber: EventHandlerSubscriber<ItemModel>): () => void;
  subscribe(eventName: 'PLACEHOLDER_ITEM_IDS_ADDED', subscriber: EventHandlerSubscriber<string[]>): () => void;
  subscribe(eventName: 'BLOCKS_UPDATED', subscriber: EventHandlerSubscriber<BlockModel[]>): () => void;
  subscribe(eventName: 'PLAYER_ADDED', subscriber: EventHandlerSubscriber<PlayerModel>): () => void;
  subscribe(eventName: 'PLAYER_UPDATED', subscriber: EventHandlerSubscriber<[PlayerModel, PlayerModel]>): () => void;
  subscribe(eventName: 'MY_PLAYER_UPDATED', subscriber: EventHandlerSubscriber<[PlayerModel, PlayerModel]>): () => void;
  subscribe(eventName: 'MY_PLAYER_POSITION_UPDATED', subscriber: EventHandlerSubscriber<[PositionVo, PositionVo]>): () => void;
  subscribe(eventName: 'MY_PLAYER_ENTERED_PORTAL_UNIT', subscriber: EventHandlerSubscriber<PortalUnitModel>): () => void;
  subscribe(eventName: 'PLAYER_REMOVED', subscriber: EventHandlerSubscriber<PlayerModel>): () => void;
  subscribe(eventName: 'PLACEHOLDER_BLOCKS_ADDED', subscriber: EventHandlerSubscriber<BlockIdVo[]>): () => void;
  subscribe(eventName: 'UNITS_UPDATED', subscriber: EventHandlerSubscriber<[itemId: string, units: UnitModel[]]>): () => void;
  subscribe(eventName: 'SELECTED_UNIT_ADDED', subscriber: EventHandlerSubscriber<UnitModel>): () => void;
  subscribe(eventName: 'SELECTED_UNIT_REMOVED', subscriber: EventHandlerSubscriber<void>): () => void;
  subscribe(eventName: 'DRAGGED_UNIT_ADDED', subscriber: EventHandlerSubscriber<{ unit: UnitModel; position: PositionVo }>): () => void;
  subscribe(
    eventName: 'DRAGGED_UNIT_POSITION_UPDATED',
    subscriber: EventHandlerSubscriber<[{ unit: UnitModel; position: PositionVo }, { unit: UnitModel; position: PositionVo }]>
  ): () => void;
  subscribe(eventName: 'DRAGGED_UNIT_REMOVED', subscriber: EventHandlerSubscriber<void>): () => void;
  subscribe(
    eventName: 'SELECTED_ITEM_ADDED',
    subscriber: EventHandlerSubscriber<{ item: ItemModel; position: PositionVo; direction: DirectionVo }>
  ): () => void;
  subscribe(
    eventName: 'SELECTED_ITEM_UPDATED',
    subscriber: EventHandlerSubscriber<
      [{ item: ItemModel; position: PositionVo; direction: DirectionVo }, { item: ItemModel; position: PositionVo; direction: DirectionVo }]
    >
  ): () => void;
  subscribe(eventName: 'SELECTED_ITEM_REMOVED', subscriber: EventHandlerSubscriber<void>): () => void;
  subscribe(eventName: 'HOVERED_POSITION_UPDATED', subscriber: EventHandlerSubscriber<PositionVo>): () => void;
  public subscribe(
    eventName:
      | 'LOCAL_COMMAND_EXECUTED'
      | 'CAMERA_POSITION_UPDATED'
      | 'ITEM_ADDED'
      | 'PLACEHOLDER_ITEM_IDS_ADDED'
      | 'BLOCKS_UPDATED'
      | 'PLAYER_ADDED'
      | 'PLAYER_UPDATED'
      | 'MY_PLAYER_UPDATED'
      | 'MY_PLAYER_POSITION_UPDATED'
      | 'MY_PLAYER_ENTERED_PORTAL_UNIT'
      | 'PLAYER_REMOVED'
      | 'PLACEHOLDER_BLOCKS_ADDED'
      | 'UNITS_UPDATED'
      | 'SELECTED_UNIT_ADDED'
      | 'SELECTED_UNIT_REMOVED'
      | 'DRAGGED_UNIT_ADDED'
      | 'DRAGGED_UNIT_POSITION_UPDATED'
      | 'DRAGGED_UNIT_REMOVED'
      | 'SELECTED_ITEM_ADDED'
      | 'SELECTED_ITEM_UPDATED'
      | 'SELECTED_ITEM_REMOVED'
      | 'HOVERED_POSITION_UPDATED',
    subscriber:
      | EventHandlerSubscriber<Command>
      | EventHandlerSubscriber<PositionVo>
      | EventHandlerSubscriber<ItemModel>
      | EventHandlerSubscriber<string[]>
      | EventHandlerSubscriber<[itemId: string, units: UnitModel[]]>
      | EventHandlerSubscriber<PlayerModel>
      | EventHandlerSubscriber<[PlayerModel, PlayerModel]>
      | EventHandlerSubscriber<[PositionVo, PositionVo]>
      | EventHandlerSubscriber<PortalUnitModel>
      | EventHandlerSubscriber<BlockIdVo[]>
      | EventHandlerSubscriber<BlockModel[]>
      | EventHandlerSubscriber<UnitModel>
      | EventHandlerSubscriber<void>
      | EventHandlerSubscriber<{ unit: UnitModel; position: PositionVo }>
      | EventHandlerSubscriber<[{ unit: UnitModel; position: PositionVo }, { unit: UnitModel; position: PositionVo }]>
      | EventHandlerSubscriber<{ item: ItemModel; position: PositionVo; direction: DirectionVo }>
      | EventHandlerSubscriber<
          [
            { item: ItemModel; position: PositionVo; direction: DirectionVo },
            { item: ItemModel; position: PositionVo; direction: DirectionVo }
          ]
        >
      | EventHandlerSubscriber<void>
  ): () => void {
    if (eventName === 'LOCAL_COMMAND_EXECUTED') {
      return this.commandManager.subscribeLocalCommandExecutedEvent(subscriber as EventHandlerSubscriber<Command>);
    } else if (eventName === 'CAMERA_POSITION_UPDATED') {
      return this.perspectiveManager.subscribePerspectiveChangedEvent(subscriber as EventHandlerSubscriber<PositionVo>);
    } else if (eventName === 'ITEM_ADDED') {
      return this.itemManager.subscribeItemAddedEvent(subscriber as EventHandlerSubscriber<ItemModel>);
    } else if (eventName === 'PLACEHOLDER_ITEM_IDS_ADDED') {
      return this.itemManager.subscribePlaceholderItemIdsAddedEvent(subscriber as EventHandlerSubscriber<string[]>);
    } else if (eventName === 'UNITS_UPDATED') {
      return this.unitManager.subscribeUnitsUpdatedEvent(subscriber as EventHandlerSubscriber<[itemId: string, units: UnitModel[]]>);
    } else if (eventName === 'PLAYER_ADDED') {
      return this.playerManager.subscribePlayerAddedEvent(subscriber as EventHandlerSubscriber<PlayerModel>);
    } else if (eventName === 'PLAYER_UPDATED') {
      return this.playerManager.subscribePlayerUpdatedEvent(subscriber as EventHandlerSubscriber<[PlayerModel, PlayerModel]>);
    } else if (eventName === 'MY_PLAYER_UPDATED') {
      return this.playerManager.subscribeMyPlayerUpdatedEvent(subscriber as EventHandlerSubscriber<[PlayerModel, PlayerModel]>);
    } else if (eventName === 'MY_PLAYER_POSITION_UPDATED') {
      return this.playerManager.subscribeMyPlayerPositionUpdatedEvent(subscriber as EventHandlerSubscriber<[PositionVo, PositionVo]>);
    } else if (eventName === 'MY_PLAYER_ENTERED_PORTAL_UNIT') {
      return this.myPlayerEnteredPortalUnitEventHandler.subscribe(subscriber as EventHandlerSubscriber<PortalUnitModel>);
    } else if (eventName === 'PLAYER_REMOVED') {
      return this.playerManager.subscribePlayerRemovedEvent(subscriber as EventHandlerSubscriber<PlayerModel>);
    } else if (eventName === 'PLACEHOLDER_BLOCKS_ADDED') {
      return this.unitManager.subscribePlaceholderBlockIdsAddedEvent(subscriber as EventHandlerSubscriber<BlockIdVo[]>);
    } else if (eventName === 'BLOCKS_UPDATED') {
      return this.unitManager.subscribeBlocksUpdatedEvent(subscriber as EventHandlerSubscriber<BlockModel[]>);
    } else if (eventName === 'SELECTED_UNIT_ADDED') {
      return this.selectionManager.subscribeSelectedUnitAdded(subscriber as EventHandlerSubscriber<UnitModel>);
    } else if (eventName === 'SELECTED_UNIT_REMOVED') {
      return this.selectionManager.subscribeSelectedUnitRemoved(subscriber as EventHandlerSubscriber<void>);
    } else if (eventName === 'DRAGGED_UNIT_ADDED') {
      return this.selectionManager.subscribeDraggedUnitAdded(
        subscriber as EventHandlerSubscriber<{ unit: UnitModel; position: PositionVo }>
      );
    } else if (eventName === 'DRAGGED_UNIT_POSITION_UPDATED') {
      return this.selectionManager.subscribeDraggedUnitPositionUpdated(
        subscriber as EventHandlerSubscriber<[{ unit: UnitModel; position: PositionVo }, { unit: UnitModel; position: PositionVo }]>
      );
    } else if (eventName === 'DRAGGED_UNIT_REMOVED') {
      return this.selectionManager.subscribeDraggedUnitRemoved(subscriber as EventHandlerSubscriber<void>);
    } else if (eventName === 'SELECTED_ITEM_ADDED') {
      return this.selectionManager.subscribeSelectedItemAdded(
        subscriber as EventHandlerSubscriber<{ item: ItemModel; direction: DirectionVo }>
      );
    } else if (eventName === 'SELECTED_ITEM_UPDATED') {
      return this.selectionManager.subscribeSelectedItemUpdated(
        subscriber as EventHandlerSubscriber<
          [
            { item: ItemModel; position: PositionVo; direction: DirectionVo },
            { item: ItemModel; position: PositionVo; direction: DirectionVo }
          ]
        >
      );
    } else if (eventName === 'SELECTED_ITEM_REMOVED') {
      return this.selectionManager.subscribeSelectedItemRemoved(subscriber as EventHandlerSubscriber<void>);
    } else if (eventName === 'HOVERED_POSITION_UPDATED') {
      return this.selectionManager.subscribeHoveredPositionUpdated(subscriber as EventHandlerSubscriber<PositionVo>);
    } else {
      return () => {};
    }
  }
}
