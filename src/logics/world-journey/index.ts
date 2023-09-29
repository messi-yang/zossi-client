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

type PerspectiveChangedHandler = (depth: number, targetPos: PositionModel) => void;
type PlayersChangedHandler = (players: PlayerModel[]) => void;
type MyPlayerChangedHandler = (player: PlayerModel) => void;
type UnitsChangedHandler = (item: ItemModel, units: UnitModel[] | null) => void;
type ItemIdsAddedHandler = (itemIds: string[]) => void;

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

  public addPerspectiveDepth() {
    this.perspective.addPerspectiveDepth();
  }

  public subtractPerspectiveDepth() {
    this.perspective.subtractPerspectiveDepth();
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

  public getPlayers(): PlayerModel[] {
    return this.playerStorage.getPlayers();
  }

  public getMyPlayer(): PlayerModel {
    return this.playerStorage.getMyPlayer();
  }

  public getPlayer(playerId: string): PlayerModel {
    return this.playerStorage.getPlayer(playerId);
  }

  public addPlayer(player: PlayerModel) {
    this.playerStorage.addPlayer(player);
  }

  public updatePlayer(player: PlayerModel) {
    this.playerStorage.updatePlayer(player);
  }

  public removePlayer(playerId: string) {
    this.playerStorage.removePlayer(playerId);
  }

  public doesPosHavePlayers(pos: PositionModel): boolean {
    return !!this.playerStorage.getPlayersAtPos(pos);
  }

  public getUnit(position: PositionModel) {
    return this.unitStorage.getUnit(position);
  }

  public addUnit(unit: UnitModel) {
    this.unitStorage.addUnit(unit);
  }

  public updateUnit(unit: UnitModel) {
    this.unitStorage.updateUnit(unit);
  }

  public removeUnit(position: PositionModel) {
    this.unitStorage.removeUnit(position);
  }

  public getItem(itemId: string): ItemModel | null {
    return this.itemStorage.getItem(itemId);
  }

  public addItem(item: ItemModel) {
    this.itemStorage.addItem(item);
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

  public subscribeItemIdsAdded(handler: ItemIdsAddedHandler): () => void {
    return this.itemStorage.subscribeItemIdsAdded((itemIds: string[]) => {
      handler(itemIds);
    });
  }
}
