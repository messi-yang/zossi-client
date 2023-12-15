import { uniq } from 'lodash';
import { BoundVo } from '@/models/world/common/bound-vo';
import { ItemModel } from '@/models/world/item/item-model';
import { PlayerModel } from '@/models/world/player/player-model';
import { UnitModel } from '@/models/world/unit/unit-model';
import { WorldModel } from '@/models/world/world/world-model';
import { PositionVo } from '@/models/world/common/position-vo';

import { UnitStorage } from './unit-storage';
import { MyPlayerChangedHandler, PlayerStorage, PlayersChangedHandler } from './player-storage';
import { Perspective, PerspectiveChangedHandler } from './perspective';
import { ItemStorage, PlaceholderItemIdsAddedHandler } from './item-storage';
import { Command } from './commands/command';
import { CommandExecutedHandler, CommandManager } from './command-manager';

type UnitsChangedHandler = (item: ItemModel, units: UnitModel[] | null) => void;

export class WorldJourney {
  private world: WorldModel;

  private unitStorage: UnitStorage;

  private playerStorage: PlayerStorage;

  private itemStorage: ItemStorage;

  private commandManager: CommandManager;

  private perspective: Perspective;

  constructor(world: WorldModel, players: PlayerModel[], myPlayerId: string, units: UnitModel[]) {
    this.world = world;

    this.unitStorage = UnitStorage.new(units);

    this.playerStorage = PlayerStorage.new(players, myPlayerId);

    this.perspective = Perspective.new(30, this.playerStorage.getMyPlayer().getPrecisePosition());

    const appearingItemIdsInUnitStorage = this.unitStorage.getAppearingItemIds();
    const appearingItemIdsInPlayerStorage = this.playerStorage.getAppearingItemIds();
    const appearingItemIds = uniq([...appearingItemIdsInUnitStorage, ...appearingItemIdsInPlayerStorage]);
    this.itemStorage = ItemStorage.new(appearingItemIds);

    this.commandManager = CommandManager.new();
  }

  static new(world: WorldModel, players: PlayerModel[], myPlayerId: string, units: UnitModel[]) {
    return new WorldJourney(world, players, myPlayerId, units);
  }

  public executeCommand(command: Command) {
    this.commandManager.executeCommand(command, {
      world: this.world,
      playerStorage: this.playerStorage,
      unitStorage: this.unitStorage,
      itemStorage: this.itemStorage,
      perspective: this.perspective,
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
    return this.playerStorage.getMyPlayer();
  }

  public doesPosHavePlayers(pos: PositionVo): boolean {
    return !!this.playerStorage.getPlayersAtPos(pos);
  }

  public getUnit(position: PositionVo) {
    return this.unitStorage.getUnit(position);
  }

  public getItem(itemId: string): ItemModel | null {
    return this.itemStorage.getItem(itemId);
  }

  public updatePlayerClientPositions() {
    this.playerStorage.getPlayers().forEach((player) => {
      if (false) {
        return;
      }

      const playerAction = player.getAction();
      const playerDirection = player.getDirection();
      const playerPrecisePosition = player.getPrecisePosition();

      if (playerAction.isStand()) return;

      if (playerAction.isWalk()) {
        const playerForwardPos = player.getFowardPosition(0.5);
        const unitAtPos = this.unitStorage.getUnit(playerForwardPos);
        if (unitAtPos) {
          const item = this.itemStorage.getItem(unitAtPos.getItemId());
          if (!item) return;
          if (!item.getTraversable()) return;
        }

        const nextPlayerPrecisePosition = playerPrecisePosition.shiftByDirection(playerDirection, 0.4);
        if (!this.world.getBound().doesContainPosition(nextPlayerPrecisePosition.toPosition())) {
          return;
        }

        const clonedPlayer = player.clone();
        clonedPlayer.updatePrecisePosition(nextPlayerPrecisePosition);
        this.playerStorage.updatePlayer(clonedPlayer);
      }
    });
  }

  public subscribePerspectiveChanged(handler: PerspectiveChangedHandler): () => void {
    return this.perspective.subscribePerspectiveChanged((depth, targetPos) => {
      handler(depth, targetPos);
    });
  }

  public subscribePlayersChanged(handler: PlayersChangedHandler): () => void {
    return this.playerStorage.subscribePlayersChanged((players) => {
      handler(players);
    });
  }

  public subscribeMyPlayerChanged(handler: MyPlayerChangedHandler): () => void {
    return this.playerStorage.subscribeMyPlayerChanged((oldPlayer, player) => {
      this.perspective.updateTargetPrecisePosition(player.getPrecisePosition());
      handler(oldPlayer, player);
    });
  }

  public subscribeUnitsChanged(handler: UnitsChangedHandler): () => void {
    const itemAddedUnsubscriber = this.itemStorage.subscribeItemAdded((item) => {
      handler(item, this.unitStorage.getUnitsByItemId(item.getId()));
    });
    const unitsChangedUnsubscriber = this.unitStorage.subscribeUnitsChanged((itemId, units) => {
      const item = this.getItem(itemId);
      if (!item) return;

      handler(item, units);
    });

    return () => {
      itemAddedUnsubscriber();
      unitsChangedUnsubscriber();
    };
  }

  public subscribePlaceholderItemIdsAdded(handler: PlaceholderItemIdsAddedHandler): () => void {
    return this.itemStorage.subscribePlaceholderItemIdsAdded((itemIds: string[]) => {
      handler(itemIds);
    });
  }

  public subscribeCommandExecuted(handler: CommandExecutedHandler): () => void {
    return this.commandManager.subscribeCommandExecuted((command: Command) => {
      handler(command);
    });
  }
}
