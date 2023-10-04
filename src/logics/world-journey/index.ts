import { uniq } from 'lodash';
import { BoundModel } from '@/models/world/bound-model';
import { ItemModel } from '@/models/world/item-model';
import { PlayerModel } from '@/models/world/player-model';
import { UnitModel } from '@/models/world/unit-model';
import { WorldModel } from '@/models/world/world-model';
import { PositionModel } from '@/models/world/position-model';

import { UnitStorage } from './unit-storage';
import { PlayerStorage } from './player-storage';
import { Perspective } from './perspective';
import { ItemStorage } from './item-storage';
import { Command } from './command';

type PerspectiveChangedHandler = (depth: number, targetPos: PositionModel) => void;
type PlayersChangedHandler = (players: PlayerModel[]) => void;
type MyPlayerChangedHandler = (player: PlayerModel) => void;
type UnitsChangedHandler = (item: ItemModel, units: UnitModel[] | null) => void;
type PlaceholderItemIdsAddedHandler = (itemIds: string[]) => void;

export class WorldJourney {
  private world: WorldModel;

  private unitStorage: UnitStorage;

  private playerStorage: PlayerStorage;

  private itemStorage: ItemStorage;

  private perspective: Perspective;

  constructor(world: WorldModel, players: PlayerModel[], myPlayerId: string, units: UnitModel[]) {
    this.world = world;

    this.unitStorage = UnitStorage.new(units);

    this.playerStorage = PlayerStorage.new(players, myPlayerId);

    this.perspective = Perspective.new(30, this.playerStorage.getMyPlayer().getPosition());

    const appearingItemIdsInUnitStorage = this.unitStorage.getAppearingItemIds();
    const appearingItemIdsInPlayerStorage = this.playerStorage.getAppearingItemIds();
    const appearingItemIds = uniq([...appearingItemIdsInUnitStorage, ...appearingItemIdsInPlayerStorage]);
    this.itemStorage = ItemStorage.new(appearingItemIds);
  }

  static new(world: WorldModel, players: PlayerModel[], myPlayerId: string, units: UnitModel[]) {
    return new WorldJourney(world, players, myPlayerId, units);
  }

  public execute(command: Command): boolean {
    const succeeded = command.execute({
      world: this.world,
      playerStorage: this.playerStorage,
      unitStorage: this.unitStorage,
      itemStorage: this.itemStorage,
      perspective: this.perspective,
    });
    return succeeded;
  }

  public getWorld(): WorldModel {
    return this.world;
  }

  public getWorldBound(): BoundModel {
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

  public doesPosHavePlayers(pos: PositionModel): boolean {
    return !!this.playerStorage.getPlayersAtPos(pos);
  }

  public getUnit(position: PositionModel) {
    return this.unitStorage.getUnit(position);
  }

  public getItem(itemId: string): ItemModel | null {
    return this.itemStorage.getItem(itemId);
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
    return this.playerStorage.subscribeMyPlayerChanged((myPlayer) => {
      this.perspective.updateTargetPos(myPlayer.getPosition());
      handler(myPlayer);
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
}
