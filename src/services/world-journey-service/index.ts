import { ItemModel } from '@/models/world/item/item-model';
import { PlayerModel } from '@/models/world/player/player-model';
import { UnitModel } from '@/models/world/unit/unit-model';
import { WorldModel } from '@/models/world/world/world-model';
import { PositionVo } from '@/models/world/common/position-vo';

import { UnitManager } from './managers/unit-manager';
import { PlayerManager } from './managers/player-manager';
import { PerspectiveManager } from './managers/perspective-manager';
import { ItemManager } from './managers/item-manager';
import { Command } from './managers/command-manager/command';
import { CommandManager } from './managers/command-manager';
import { ChangePlayerPrecisePositionCommand } from './managers/command-manager/commands/change-player-precise-position-command';
import { EventHandlerSubscriber } from './managers/common/event-handler';
import { PrecisePositionVo } from '@/models/world/common/precise-position-vo';
import { BlockModel } from '@/models/world/block/block-model';
import { BlockIdVo } from '@/models/world/block/block-id-vo';

export class WorldJourneyService {
  private world: WorldModel;

  private unitManager: UnitManager;

  private playerManager: PlayerManager;

  private itemManager: ItemManager;

  private commandManager: CommandManager;

  private perspectiveManager: PerspectiveManager;

  private animateId: number | null = null;

  private calculatePlayerPositionTickFps;

  private calculatePlayerPositionTickCount;

  constructor(world: WorldModel, players: PlayerModel[], myPlayerId: string, blocks: BlockModel[], units: UnitModel[]) {
    this.world = world;

    this.unitManager = UnitManager.create(blocks, units);

    this.playerManager = PlayerManager.create(players, myPlayerId);

    this.perspectiveManager = PerspectiveManager.create(20, this.playerManager.getMyPlayer().getPrecisePosition());

    this.itemManager = ItemManager.create();

    this.commandManager = CommandManager.create(world, this.playerManager, this.unitManager, this.itemManager, this.perspectiveManager);

    this.calculatePlayerPositionTickFps = 24;
    this.calculatePlayerPositionTickCount = 0;
    this.calculatePlayerPositionTicker();

    this.subscribe('MY_PLAYER_UPDATED', ([, newPlayer]) => {
      this.perspectiveManager.updateTargetPrecisePosition(newPlayer.getPrecisePosition());

      const worldId = world.getId();
      this.unitManager.addPlaceholderBlockIds(newPlayer.getNearBlockIds(worldId));
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

  public addPerspectiveDepth() {
    this.perspectiveManager.addPerspectiveDepth();
  }

  public subtractPerspectiveDepth() {
    this.perspectiveManager.subtractPerspectiveDepth();
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

  public getUnit(position: PositionVo) {
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

  private calculatePlayerPosition() {
    this.calculatePlayerPositionTickCount += 1;

    const myPlayer = this.playerManager.getMyPlayer();
    const myPlayerAction = myPlayer.getAction();
    if (myPlayerAction.isStand()) {
      if (this.calculatePlayerPositionTickCount % 10 === 0) {
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

      const nextMyPlayerPrecisePosition = myPlayerPrecisePosition.shiftByDirection(
        myPlayerDirection,
        5 / this.calculatePlayerPositionTickFps
      );

      this.executeLocalCommand(ChangePlayerPrecisePositionCommand.create(myPlayer.getId(), nextMyPlayerPrecisePosition));
    }
  }

  private calculatePlayerPositionTicker() {
    const frameDelay = 1000 / this.calculatePlayerPositionTickFps;
    let lastFrameTime = 0;

    const animate = () => {
      const currentTime = performance.now();
      const elapsed = currentTime - lastFrameTime;
      if (elapsed > frameDelay) {
        this.calculatePlayerPosition();
        lastFrameTime = currentTime - (elapsed % frameDelay);
      }
      this.animateId = requestAnimationFrame(animate);
    };
    animate();
  }

  subscribe(eventName: 'LOCAL_COMMAND_EXECUTED', subscriber: EventHandlerSubscriber<Command>): () => void;
  subscribe(
    eventName: 'PERSPECTIVE_CHANGED',
    subscriber: EventHandlerSubscriber<[perspectiveDepth: number, targetPrecisePosition: PrecisePositionVo]>
  ): () => void;
  subscribe(eventName: 'ITEM_ADDED', subscriber: EventHandlerSubscriber<ItemModel>): () => void;
  subscribe(eventName: 'PLACEHOLDER_ITEM_IDS_ADDED', subscriber: EventHandlerSubscriber<string[]>): () => void;
  subscribe(eventName: 'BLOCKS_UPDATED', subscriber: EventHandlerSubscriber<BlockModel[]>): () => void;
  subscribe(eventName: 'PLAYER_ADDED', subscriber: EventHandlerSubscriber<PlayerModel>): () => void;
  subscribe(eventName: 'PLAYER_UPDATED', subscriber: EventHandlerSubscriber<[PlayerModel, PlayerModel]>): () => void;
  subscribe(eventName: 'MY_PLAYER_UPDATED', subscriber: EventHandlerSubscriber<[PlayerModel, PlayerModel]>): () => void;
  subscribe(eventName: 'PLAYER_REMOVED', subscriber: EventHandlerSubscriber<PlayerModel>): () => void;
  subscribe(eventName: 'PLACEHOLDER_BLOCKS_ADDED', subscriber: EventHandlerSubscriber<BlockIdVo[]>): () => void;
  subscribe(eventName: 'UNITS_CHANGED', subscriber: EventHandlerSubscriber<[itemId: string, units: UnitModel[]]>): () => void;
  public subscribe(
    eventName:
      | 'LOCAL_COMMAND_EXECUTED'
      | 'PERSPECTIVE_CHANGED'
      | 'ITEM_ADDED'
      | 'PLACEHOLDER_ITEM_IDS_ADDED'
      | 'BLOCKS_UPDATED'
      | 'PLAYER_ADDED'
      | 'PLAYER_UPDATED'
      | 'MY_PLAYER_UPDATED'
      | 'PLAYER_REMOVED'
      | 'PLACEHOLDER_BLOCKS_ADDED'
      | 'UNITS_CHANGED',
    subscriber:
      | EventHandlerSubscriber<Command>
      | EventHandlerSubscriber<[perspectiveDepth: number, targetPrecisePosition: PrecisePositionVo]>
      | EventHandlerSubscriber<ItemModel>
      | EventHandlerSubscriber<string[]>
      | EventHandlerSubscriber<[itemId: string, units: UnitModel[]]>
      | EventHandlerSubscriber<PlayerModel>
      | EventHandlerSubscriber<[PlayerModel, PlayerModel]>
      | EventHandlerSubscriber<BlockIdVo[]>
      | EventHandlerSubscriber<BlockModel[]>
  ): () => void {
    if (eventName === 'LOCAL_COMMAND_EXECUTED') {
      return this.commandManager.subscribeLocalCommandExecutedEvent(subscriber as EventHandlerSubscriber<Command>);
    } else if (eventName === 'PERSPECTIVE_CHANGED') {
      return this.perspectiveManager.subscribePerspectiveChangedEvent(
        subscriber as EventHandlerSubscriber<[perspectiveDepth: number, targetPrecisePosition: PrecisePositionVo]>
      );
    } else if (eventName === 'ITEM_ADDED') {
      return this.itemManager.subscribeItemAddedEvent(subscriber as EventHandlerSubscriber<ItemModel>);
    } else if (eventName === 'PLACEHOLDER_ITEM_IDS_ADDED') {
      return this.itemManager.subscribePlaceholderItemIdsAddedEvent(subscriber as EventHandlerSubscriber<string[]>);
    } else if (eventName === 'UNITS_CHANGED') {
      return this.unitManager.subscribeUnitsChangedEvent(subscriber as EventHandlerSubscriber<[itemId: string, units: UnitModel[]]>);
    } else if (eventName === 'PLAYER_ADDED') {
      return this.playerManager.subscribePlayerAddedEvent(subscriber as EventHandlerSubscriber<PlayerModel>);
    } else if (eventName === 'PLAYER_UPDATED') {
      return this.playerManager.subscribePlayerUpdatedEvent(subscriber as EventHandlerSubscriber<[PlayerModel, PlayerModel]>);
    } else if (eventName === 'MY_PLAYER_UPDATED') {
      return this.playerManager.subscribeMyPlayerUpdatedEvent(subscriber as EventHandlerSubscriber<[PlayerModel, PlayerModel]>);
    } else if (eventName === 'PLAYER_REMOVED') {
      return this.playerManager.subscribePlayerRemovedEvent(subscriber as EventHandlerSubscriber<PlayerModel>);
    } else if (eventName === 'PLACEHOLDER_BLOCKS_ADDED') {
      return this.unitManager.subscribePlaceholderBlockIdsAddedEvent(subscriber as EventHandlerSubscriber<BlockIdVo[]>);
    } else if (eventName === 'BLOCKS_UPDATED') {
      return this.unitManager.subscribeBlocksUpdatedEvent(subscriber as EventHandlerSubscriber<BlockModel[]>);
    } else {
      return () => {};
    }
  }
}
