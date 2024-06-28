import { uniq } from 'lodash';
import { BoundVo } from '@/models/world/common/bound-vo';
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

  constructor(world: WorldModel, players: PlayerModel[], myPlayerId: string, units: UnitModel[]) {
    this.world = world;

    this.unitManager = UnitManager.create(units);

    this.playerManager = PlayerManager.create(players, myPlayerId);

    this.perspectiveManager = PerspectiveManager.create(30, this.playerManager.getMyPlayer().getPrecisePosition());

    const appearingItemIdsInUnitManager = this.unitManager.getAppearingItemIds();
    const appearingItemIdsInPlayerManager = this.playerManager.getAppearingItemIds();
    const appearingItemIds = uniq([...appearingItemIdsInUnitManager, ...appearingItemIdsInPlayerManager]);
    this.itemManager = ItemManager.create(appearingItemIds);

    this.commandManager = CommandManager.create();

    this.calculatePlayerPositionTickFps = 24;
    this.calculatePlayerPositionTickCount = 0;
    this.calculatePlayerPositionTicker();

    this.subscribe('UNITS_CHANGED', ([itemId]) => {
      this.itemManager.addPlaceholderItemId(itemId);
    });

    this.subscribe('PLAYER_UPDATED', ([, newPlayer]) => {
      const playerHeldItemId = newPlayer.getHeldItemId();
      if (playerHeldItemId) this.itemManager.addPlaceholderItemId(playerHeldItemId);

      if (this.isMyPlayer(newPlayer)) {
        this.perspectiveManager.updateTargetPrecisePosition(newPlayer.getPrecisePosition());
      }
    });
  }

  public destroy() {
    if (this.animateId !== null) {
      cancelAnimationFrame(this.animateId);
    }
  }

  static create(world: WorldModel, players: PlayerModel[], myPlayerId: string, units: UnitModel[]) {
    return new WorldJourneyService(world, players, myPlayerId, units);
  }

  public removeFailedCommand(commandId: string) {
    this.commandManager.removeFailedCommand(commandId, {
      world: this.world,
      playerManager: this.playerManager,
      unitManager: this.unitManager,
      itemManager: this.itemManager,
      perspectiveManager: this.perspectiveManager,
    });
  }

  public replayCommands(miliseconds: number) {
    this.commandManager.replayCommands(miliseconds, {
      world: this.world,
      playerManager: this.playerManager,
      unitManager: this.unitManager,
      itemManager: this.itemManager,
      perspectiveManager: this.perspectiveManager,
    });
  }

  public executeCommand(command: Command) {
    this.commandManager.executeCommand(command, {
      world: this.world,
      playerManager: this.playerManager,
      unitManager: this.unitManager,
      itemManager: this.itemManager,
      perspectiveManager: this.perspectiveManager,
    });
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

  public getWorldBound(): BoundVo {
    return this.world.getBound();
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

  public getUnit(position: PositionVo) {
    return this.unitManager.getUnitByPos(position);
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

  public getItem(itemId: string): ItemModel | null {
    return this.itemManager.getItem(itemId);
  }

  private calculatePlayerPosition() {
    this.calculatePlayerPositionTickCount += 1;

    const myPlayer = this.playerManager.getMyPlayer();
    const myPlayerAction = myPlayer.getAction();
    if (myPlayerAction.isStand()) {
      if (this.calculatePlayerPositionTickCount % 10 === 0) {
        this.executeCommand(ChangePlayerPrecisePositionCommand.create(myPlayer.getId(), myPlayer.getPrecisePosition()));
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
      if (!this.world.getBound().doesContainPosition(nextMyPlayerPrecisePosition.toPosition())) {
        return;
      }

      this.executeCommand(ChangePlayerPrecisePositionCommand.create(myPlayer.getId(), nextMyPlayerPrecisePosition));
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

  subscribe(eventName: 'COMMAND_EXECUTED', subscriber: EventHandlerSubscriber<Command>): () => void;
  subscribe(
    eventName: 'PERSPECTIVE_CHANGED',
    subscriber: EventHandlerSubscriber<[perspectiveDepth: number, targetPrecisePosition: PrecisePositionVo]>
  ): () => void;
  subscribe(eventName: 'ITEM_ADDED', subscriber: EventHandlerSubscriber<ItemModel>): () => void;
  subscribe(eventName: 'PLACEHOLDER_ITEM_IDS_ADDED', subscriber: EventHandlerSubscriber<string[]>): () => void;
  subscribe(eventName: 'UNITS_CHANGED', subscriber: EventHandlerSubscriber<[itemId: string, units: UnitModel[]]>): () => void;
  subscribe(eventName: 'PLAYER_ADDED', subscriber: EventHandlerSubscriber<PlayerModel>): () => void;
  subscribe(eventName: 'PLAYER_UPDATED', subscriber: EventHandlerSubscriber<[PlayerModel, PlayerModel]>): () => void;
  subscribe(eventName: 'PLAYER_REMOVED', subscriber: EventHandlerSubscriber<PlayerModel>): () => void;
  public subscribe(
    eventName:
      | 'COMMAND_EXECUTED'
      | 'PERSPECTIVE_CHANGED'
      | 'ITEM_ADDED'
      | 'PLACEHOLDER_ITEM_IDS_ADDED'
      | 'UNITS_CHANGED'
      | 'PLAYER_ADDED'
      | 'PLAYER_UPDATED'
      | 'PLAYER_REMOVED',
    subscriber:
      | EventHandlerSubscriber<Command>
      | EventHandlerSubscriber<[perspectiveDepth: number, targetPrecisePosition: PrecisePositionVo]>
      | EventHandlerSubscriber<ItemModel>
      | EventHandlerSubscriber<string[]>
      | EventHandlerSubscriber<[itemId: string, units: UnitModel[]]>
      | EventHandlerSubscriber<PlayerModel>
      | EventHandlerSubscriber<[PlayerModel, PlayerModel]>
  ): () => void {
    if (eventName === 'COMMAND_EXECUTED') {
      return this.commandManager.subscribeCommandExecutedEvent(subscriber as EventHandlerSubscriber<Command>);
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
    } else if (eventName === 'PLAYER_REMOVED') {
      return this.playerManager.subscribePlayerRemovedEvent(subscriber as EventHandlerSubscriber<PlayerModel>);
    } else {
      return () => {};
    }
  }
}
