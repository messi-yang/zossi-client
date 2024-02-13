import { uniq } from 'lodash';
import { BoundVo } from '@/models/world/common/bound-vo';
import { ItemModel } from '@/models/world/item/item-model';
import { PlayerModel } from '@/models/world/player/player-model';
import { UnitModel } from '@/models/world/unit/unit-model';
import { WorldModel } from '@/models/world/world/world-model';
import { PositionVo } from '@/models/world/common/position-vo';

import { UnitManager, UnitsChangedHandler } from './managers/unit-manager';
import { MyPlayerChangedHandler, PlayerManager, PlayersChangedHandler } from './managers/player-manager';
import { PerspectiveManager, PerspectiveChangedHandler } from './managers/perspective-manager';
import { ItemAddedHandler, ItemManager, PlaceholderItemIdsAddedHandler } from './managers/item-manager';
import { Command } from './managers/command-manager/command';
import { CommandManager } from './managers/command-manager';

export class WorldJourneyService {
  private world: WorldModel;

  private unitManager: UnitManager;

  private playerManager: PlayerManager;

  private itemManager: ItemManager;

  private commandManager: CommandManager;

  private perspectiveManager: PerspectiveManager;

  private animateId: number | null = null;

  constructor(world: WorldModel, players: PlayerModel[], myPlayerId: string, units: UnitModel[]) {
    this.world = world;

    this.unitManager = UnitManager.new(units);

    this.playerManager = PlayerManager.new(players, myPlayerId);

    this.perspectiveManager = PerspectiveManager.new(30, this.playerManager.getMyPlayer().getPrecisePosition());

    const appearingItemIdsInUnitManager = this.unitManager.getAppearingItemIds();
    const appearingItemIdsInPlayerManager = this.playerManager.getAppearingItemIds();
    const appearingItemIds = uniq([...appearingItemIdsInUnitManager, ...appearingItemIdsInPlayerManager]);
    this.itemManager = ItemManager.new(appearingItemIds);

    this.commandManager = CommandManager.new();

    this.calculatePlayerPositionsTicker();
    this.subscribeMyPlayerChanged((_, newMyPlayer) => {
      this.perspectiveManager.updateTargetPrecisePosition(newMyPlayer.getPrecisePosition());
    });
  }

  public destroy() {
    if (this.animateId !== null) {
      cancelAnimationFrame(this.animateId);
    }
  }

  static new(world: WorldModel, players: PlayerModel[], myPlayerId: string, units: UnitModel[]) {
    return new WorldJourneyService(world, players, myPlayerId, units);
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

  public getMyPlayer(): PlayerModel {
    return this.playerManager.getMyPlayer();
  }

  public getPlayers(): PlayerModel[] {
    return this.playerManager.getPlayers();
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

  private calculatePlayerPositions() {
    this.playerManager.getPlayers().forEach((player) => {
      const playerAction = player.getAction();
      const playerDirection = player.getDirection();
      const playerPrecisePosition = player.getPrecisePosition();

      if (playerAction.isStand()) return;

      if (playerAction.isWalk()) {
        const playerForwardPos = player.getFowardPosition(0.5);
        const unitAtPos = this.unitManager.getUnitByPos(playerForwardPos);
        if (unitAtPos) {
          const item = this.itemManager.getItem(unitAtPos.getItemId());
          if (!item) return;
          if (!item.getTraversable()) return;
        }

        const nextPlayerPrecisePosition = playerPrecisePosition.shiftByDirection(playerDirection, 0.2);
        if (!this.world.getBound().doesContainPosition(nextPlayerPrecisePosition.toPosition())) {
          return;
        }

        const clonedPlayer = player.clone();
        clonedPlayer.updatePrecisePosition(nextPlayerPrecisePosition);
        this.playerManager.updatePlayer(clonedPlayer);
      }
    });
  }

  private calculatePlayerPositionsTicker() {
    const maxFPS = 25;
    const frameDelay = 1000 / maxFPS;
    let lastFrameTime = 0;

    const animate = () => {
      const currentTime = performance.now();
      const elapsed = currentTime - lastFrameTime;
      if (elapsed > frameDelay) {
        this.calculatePlayerPositions();
        lastFrameTime = currentTime - (elapsed % frameDelay);
      }
      this.animateId = requestAnimationFrame(animate);
    };
    animate();
  }

  public subscribePerspectiveChanged(handler: PerspectiveChangedHandler): () => void {
    return this.perspectiveManager.subscribePerspectiveChanged(handler);
  }

  public subscribePlayersChanged(handler: PlayersChangedHandler): () => void {
    return this.playerManager.subscribePlayersChanged(handler);
  }

  public subscribeMyPlayerChanged(handler: MyPlayerChangedHandler): () => void {
    return this.playerManager.subscribeMyPlayerChanged(handler);
  }

  public subscribeItemAdded(handler: ItemAddedHandler): () => void {
    return this.itemManager.subscribeItemAdded(handler);
  }

  public subscribeUnitsChanged(handler: UnitsChangedHandler): () => void {
    const unitsChangedUnsubscriber = this.unitManager.subscribeUnitsChanged(handler);

    return () => {
      unitsChangedUnsubscriber();
    };
  }

  public subscribePlaceholderItemIdsAdded(handler: PlaceholderItemIdsAddedHandler): () => void {
    return this.itemManager.subscribePlaceholderItemIdsAdded((itemIds: string[]) => {
      handler(itemIds);
    });
  }
}
