import { uniq } from 'lodash';
import { BoundModel } from '@/models/world/bound-model';
import { ItemModel } from '@/models/world/item-model';
import { PlayerModel } from '../models/world/player-model';
import { UnitModel } from '../models/world/unit-model';
import { WorldModel } from '../models/world/world-model';
import { PositionModel } from '@/models/world/position-model';

type PerspectiveChangedHandler = (perspectiveDepth: number, targetPos: PositionModel) => void;
type PlayersChangedHandler = (players: PlayerModel[]) => void;
type MyPlayerChangedHandler = (player: PlayerModel) => void;
type UnitsChangedHandler = (item: ItemModel, units: UnitModel[] | null) => void;

export class WorldJourneyManager {
  private perspectiveDepth: number;

  private world: WorldModel;

  private myPlayerId: string;

  private playerMap: Record<string, PlayerModel> = {};

  private playersMapByPos: Record<string, PlayerModel[] | undefined> = {};

  private unitMapByPos: Record<string, UnitModel | undefined>;

  private unitsMapByItemId: Record<string, UnitModel[] | undefined>;

  private appearingItemIds: string[];

  private appearingItemMap: Record<string, ItemModel | undefined> = {};

  private perspectiveChangedHandlers: PerspectiveChangedHandler[] = [];

  private playersChangedHandlers: PlayersChangedHandler[] = [];

  private myPlayerChangedHandlers: MyPlayerChangedHandler[] = [];

  private unitsChangedHandler: UnitsChangedHandler[] = [];

  constructor(world: WorldModel, players: PlayerModel[], myPlayerId: string, units: UnitModel[]) {
    this.perspectiveDepth = 30;
    this.world = world;

    this.unitMapByPos = {};
    this.unitsMapByItemId = {};
    units.forEach((unit) => {
      this.addUnitToUnitMapByItemId(unit);
      this.addUnitToUnitMapByPos(unit);
    });

    // this.players = players;
    this.myPlayerId = myPlayerId;

    this.playerMap = {};
    players.forEach((player) => {
      this.updatePlayerInPlayerMap(player);
    });

    this.playersMapByPos = {};
    players.forEach((player) => {
      this.addPlayerToPlayerMapByPos(player);
    });

    // Collect all appearing item ids
    this.appearingItemIds = [];
    units
      .map((unit) => unit.getItemId())
      .forEach((itemId) => {
        this.appearingItemIds.push(itemId);
      });
    players.forEach((player) => {
      const playerHeldItemId = player.getHeldItemId();
      if (playerHeldItemId) {
        this.appearingItemIds.push(playerHeldItemId);
      }
    });
    this.appearingItemIds = uniq(this.appearingItemIds);
  }

  static new(world: WorldModel, players: PlayerModel[], myPlayerId: string, units: UnitModel[]) {
    return new WorldJourneyManager(world, players, myPlayerId, units);
  }

  public addPerspectiveDepth() {
    if (this.perspectiveDepth <= 10) return;
    this.perspectiveDepth -= 10;
    this.publishPerspectiveChanged(this.perspectiveDepth, this.getMyPlayer().getPosition());
  }

  public subtractPerspectiveDepth() {
    if (this.perspectiveDepth >= 200) return;
    this.perspectiveDepth += 10;
    this.publishPerspectiveChanged(this.perspectiveDepth, this.getMyPlayer().getPosition());
  }

  public getWorld(): WorldModel {
    return this.world;
  }

  public getWorldBound(): BoundModel {
    return this.world.getBound();
  }

  public getPlayers(): PlayerModel[] {
    return Object.values(this.playerMap);
  }

  public getMyPlayer(): PlayerModel {
    return this.playerMap[this.myPlayerId];
  }

  public getPlayer(playerId: string): PlayerModel {
    return this.playerMap[playerId];
  }

  private isMyPlayer(playerId: string): boolean {
    return playerId === this.myPlayerId;
  }

  private addPlayerInPlayerMap(player: PlayerModel) {
    this.playerMap[player.getId()] = player;
  }

  private updatePlayerInPlayerMap(player: PlayerModel) {
    this.playerMap[player.getId()] = player;
  }

  private removePlayerFromPlayerMap(playerId: string) {
    delete this.playerMap[playerId];
  }

  private addPlayerToPlayerMapByPos(player: PlayerModel) {
    const posKey = player.getPosition().toString();
    const playersInOldPos = this.playersMapByPos[posKey];
    if (playersInOldPos) {
      playersInOldPos.push(player);
    } else {
      this.playersMapByPos[posKey] = [player];
    }
  }

  private updatePlayerInPlayerMapByPos(oldPlayer: PlayerModel, player: PlayerModel) {
    this.removePlayerFromPlayerMapByPos(oldPlayer);
    this.addPlayerToPlayerMapByPos(player);
  }

  private removePlayerFromPlayerMapByPos(player: PlayerModel) {
    const playerId = player.getId();
    const posKey = player.getPosition().toString();
    const playersInOldPos = this.playersMapByPos[posKey];
    if (playersInOldPos) {
      const newPlayersInOldPos = playersInOldPos.filter((p) => p.getId() !== playerId);
      if (newPlayersInOldPos.length === 0) {
        delete this.playersMapByPos[posKey];
      } else {
        this.playersMapByPos[posKey] = newPlayersInOldPos;
      }
    }
  }

  public addPlayer(player: PlayerModel) {
    if (this.getPlayer(player.getId())) return;

    this.addPlayerInPlayerMap(player);
    this.addPlayerToPlayerMapByPos(player);

    this.publishPlayersChanged(this.getPlayers());
  }

  public updatePlayer(player: PlayerModel) {
    const oldPlayer = this.getPlayer(player.getId());
    if (!oldPlayer) return;

    this.updatePlayerInPlayerMap(player);
    this.updatePlayerInPlayerMapByPos(oldPlayer, player);

    this.publishPlayersChanged(this.getPlayers());

    if (this.isMyPlayer(player.getId())) {
      this.publishPerspectiveChanged(this.perspectiveDepth, this.getMyPlayer().getPosition());
      this.publishMyPlayerChanged(this.getMyPlayer());
    }
  }

  public removePlayer(playerId: string) {
    const currentPlayer = this.getPlayer(playerId);
    if (!currentPlayer) return;

    this.removePlayerFromPlayerMapByPos(currentPlayer);
    this.removePlayerFromPlayerMap(playerId);

    this.publishPlayersChanged(this.getPlayers());
  }

  public getMyPlayerHeldItem(): ItemModel | null {
    const heldItemId = this.getMyPlayer().getHeldItemId();
    if (!heldItemId) return null;
    return this.appearingItemMap[heldItemId] || null;
  }

  public doesPosHavePlayers(pos: PositionModel): boolean {
    return !!this.playersMapByPos[pos.toString()];
  }

  public getUnitAtPos(pos: PositionModel): UnitModel | null {
    return this.unitMapByPos[pos.toString()] || null;
  }

  public getUnitsByItemId(itemId: string): UnitModel[] | null {
    return this.unitsMapByItemId[itemId] || null;
  }

  private addUnitToUnitMapByPos(unit: UnitModel) {
    const posKey = unit.getPosition().toString();
    this.unitMapByPos[posKey] = unit;
  }

  private updateUnitInUnitMapByPos(unit: UnitModel) {
    const posKey = unit.getPosition().toString();
    this.unitMapByPos[posKey] = unit;
  }

  private removeUnitFromUnitMapByPos(position: PositionModel) {
    const posKey = position.toString();
    delete this.unitMapByPos[posKey];
  }

  private addUnitToUnitMapByItemId(unit: UnitModel) {
    const itemId = unit.getItemId();
    const unitsWithItemId = this.unitsMapByItemId[itemId];
    if (unitsWithItemId) {
      unitsWithItemId.push(unit);
    } else {
      this.unitsMapByItemId[itemId] = [unit];
    }
  }

  private removeUnitFromUnitMapByItemId(oldUnit: UnitModel) {
    const itemId = oldUnit.getItemId();
    const unitsWithItemId = this.unitsMapByItemId[itemId];
    if (unitsWithItemId) {
      const newUnitsWithItemId = unitsWithItemId.filter((unit) => !unit.getPosition().isEqual(oldUnit.getPosition()));
      if (newUnitsWithItemId.length === 0) {
        delete this.unitsMapByItemId[itemId];
      } else {
        this.unitsMapByItemId[itemId] = newUnitsWithItemId;
      }
    }
  }

  private updateUnitFromUnitMapByItemId(oldUnit: UnitModel, unit: UnitModel) {
    this.removeUnitFromUnitMapByItemId(oldUnit);
    this.addUnitToUnitMapByItemId(unit);
  }

  public addUnit(unit: UnitModel) {
    const currentUnit = this.getUnitAtPos(unit.getPosition());
    if (currentUnit) return;

    this.addUnitToUnitMapByPos(unit);
    this.addUnitToUnitMapByItemId(unit);

    this.publishUnitsChanged(unit.getItemId());
  }

  public updateUnit(unit: UnitModel) {
    const currentUnit = this.getUnitAtPos(unit.getPosition());
    if (!currentUnit) return;

    this.updateUnitInUnitMapByPos(unit);
    this.updateUnitFromUnitMapByItemId(currentUnit, unit);

    const itemIds = [currentUnit.getItemId(), unit.getItemId()];
    uniq(itemIds).forEach((itemId) => {
      this.publishUnitsChanged(itemId);
    });
  }

  public removeUnit(position: PositionModel) {
    const currentUnit = this.getUnitAtPos(position);
    if (!currentUnit) return;

    this.removeUnitFromUnitMapByPos(currentUnit.getPosition());
    this.removeUnitFromUnitMapByItemId(currentUnit);

    this.publishUnitsChanged(currentUnit.getItemId());
  }

  public getAppearingItemIds(): string[] {
    return this.appearingItemIds;
  }

  public getAppearingItem(itemId: string): ItemModel | null {
    return this.appearingItemMap[itemId] || null;
  }

  public addAppearingItem(item: ItemModel) {
    this.appearingItemMap[item.getId()] = item;
  }

  public subscribePerspectiveChanged(handler: PerspectiveChangedHandler): () => void {
    this.perspectiveChangedHandlers.push(handler);
    handler(this.perspectiveDepth, this.getMyPlayer().getPosition());

    return () => {
      this.perspectiveChangedHandlers = this.perspectiveChangedHandlers.filter((hdl) => hdl !== handler);
    };
  }

  private publishPerspectiveChanged(perspectiveDepth: number, targetPos: PositionModel) {
    this.perspectiveChangedHandlers.forEach((hdl) => {
      hdl(perspectiveDepth, targetPos);
    });
  }

  public subscribePlayersChanged(handler: PlayersChangedHandler): () => void {
    this.playersChangedHandlers.push(handler);
    handler(this.getPlayers());

    return () => {
      this.playersChangedHandlers = this.playersChangedHandlers.filter((hdl) => hdl !== handler);
    };
  }

  private publishPlayersChanged(players: PlayerModel[]) {
    this.playersChangedHandlers.forEach((hdl) => {
      hdl(players);
    });
  }

  public subscribeMyPlayerChanged(handler: MyPlayerChangedHandler): () => void {
    this.myPlayerChangedHandlers.push(handler);
    handler(this.getMyPlayer());

    return () => {
      this.myPlayerChangedHandlers = this.myPlayerChangedHandlers.filter((hdl) => hdl !== handler);
    };
  }

  private publishMyPlayerChanged(myPlayer: PlayerModel) {
    this.myPlayerChangedHandlers.forEach((hdl) => {
      hdl(myPlayer);
    });
  }

  public subscribeUnitsChanged(handler: UnitsChangedHandler): () => void {
    this.unitsChangedHandler.push(handler);

    this.getAppearingItemIds().forEach((itemId) => {
      const item = this.getAppearingItem(itemId);
      if (!item) return;
      handler(item, this.getUnitsByItemId(itemId));
    });

    return () => {
      this.unitsChangedHandler = this.unitsChangedHandler.filter((hdl) => hdl !== handler);
    };
  }

  private publishUnitsChanged(itemId: string) {
    const item = this.getAppearingItem(itemId);
    if (!item) return;

    this.unitsChangedHandler.forEach((hdl) => {
      hdl(item, this.getUnitsByItemId(itemId));
    });
  }
}
