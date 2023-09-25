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

export class WorldJourneyManager {
  private perspectiveDepth: number;

  private world: WorldModel;

  private players: PlayerModel[];

  private myPlayerId: string;

  private playerMap: Record<string, PlayerModel> = {};

  private playerMapByPos: Record<string, PlayerModel[] | undefined> = {};

  private units: UnitModel[];

  private unitMapByPos: Record<string, UnitModel | undefined>;

  private unitMapByItemId: Record<string, UnitModel[] | undefined>;

  private appearingItemIds: string[];

  private appearingItemMap: Record<string, ItemModel | undefined> = {};

  private perspectiveChangedHandlers: PerspectiveChangedHandler[] = [];

  private playersChangedHandlers: PlayersChangedHandler[] = [];

  private myPlayerChangedHandlers: MyPlayerChangedHandler[] = [];

  constructor(world: WorldModel, players: PlayerModel[], myPlayerId: string, units: UnitModel[]) {
    this.perspectiveDepth = 30;
    this.world = world;
    this.units = units;
    this.unitMapByPos = {};
    this.unitMapByItemId = {};
    this.units.forEach((unit) => {
      const positionKey = unit.getPosition().toString();
      this.unitMapByPos[positionKey] = unit;

      const itemId = unit.getItemId();
      const unitsWithItemId = this.unitMapByItemId[itemId];
      if (unitsWithItemId) {
        unitsWithItemId.push(unit);
      } else {
        this.unitMapByItemId[itemId] = [unit];
      }
    });

    this.players = players;
    this.myPlayerId = myPlayerId;

    this.playerMap = this.players.reduce(
      (prev, p) => ({
        ...prev,
        [p.getId()]: p,
      }),
      {}
    );
    this.playerMapByPos = {};
    this.players.forEach((player) => {
      this.addPlayerToPlayerMapByPos(player);
    });

    // Collect all appearing item ids
    this.appearingItemIds = [];
    this.units
      .map((unit) => unit.getItemId())
      .forEach((itemId) => {
        this.appearingItemIds.push(itemId);
      });
    this.players.forEach((player) => {
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
    return this.players;
  }

  public getMyPlayer(): PlayerModel {
    return this.playerMap[this.myPlayerId];
  }

  private isMyPlayer(playerId: string): boolean {
    return playerId === this.myPlayerId;
  }

  private addPlayerToPlayerMapByPos(player: PlayerModel) {
    const posKey = player.getPosition().toString();
    const playersInOldPos = this.playerMapByPos[posKey];
    if (playersInOldPos) {
      playersInOldPos.push(player);
    } else {
      this.playerMapByPos[posKey] = [player];
    }
  }

  private removePlayerFromPlayerMapByPos(player: PlayerModel) {
    const playerId = player.getId();
    const posKey = player.getPosition().toString();
    const playersInOldPos = this.playerMapByPos[posKey];
    if (playersInOldPos) {
      const newPlayersInOldPos = playersInOldPos.filter((p) => p.getId() !== playerId);
      if (newPlayersInOldPos.length === 0) {
        delete this.playerMapByPos[posKey];
      } else {
        this.playerMapByPos[posKey] = newPlayersInOldPos;
      }
    }
  }

  public addPlayer(player: PlayerModel) {
    const playerId = player.getId();

    this.players.push(player);
    this.playerMap[playerId] = player;

    this.addPlayerToPlayerMapByPos(player);
    this.publishPlayersChanged(this.players);
  }

  public updatePlayer(player: PlayerModel) {
    const playerIndex = this.players.findIndex((p) => p.getId() === player.getId());
    if (playerIndex === -1) return;

    this.players[playerIndex] = player;

    const playerId = player.getId();
    const oldPlayer = this.playerMap[playerId];

    this.removePlayerFromPlayerMapByPos(oldPlayer);
    this.addPlayerToPlayerMapByPos(player);

    this.playerMap[playerId] = player;

    this.publishPlayersChanged(this.players);

    if (this.isMyPlayer(playerId)) {
      this.publishPerspectiveChanged(this.perspectiveDepth, this.getMyPlayer().getPosition());
      this.publishMyPlayerChanged(this.getMyPlayer());
    }
  }

  public removePlayer(playerId: string) {
    const player = this.playerMap[playerId];

    this.players = this.players.filter((p) => p.getId() !== playerId);
    this.removePlayerFromPlayerMapByPos(player);
    delete this.playerMap[playerId];

    this.publishPlayersChanged(this.players);
  }

  public getMyPlayerHeldItem(): ItemModel | null {
    const heldItemId = this.getMyPlayer().getHeldItemId();
    if (!heldItemId) return null;
    return this.appearingItemMap[heldItemId] || null;
  }

  public doesPosHavePlayers(pos: PositionModel): boolean {
    return !!this.playerMapByPos[pos.toString()];
  }

  public getUnits() {
    return this.units;
  }

  public getUnitAtPos(pos: PositionModel): UnitModel | null {
    console.log(pos, pos.toString(), this.unitMapByPos, this.unitMapByPos[pos.toString()]);

    return this.unitMapByPos[pos.toString()] || null;
  }

  public addUnit(unit: UnitModel) {
    const posKey = unit.getPosition().toString();
    this.units.push(unit);
    this.unitMapByPos[posKey] = unit;
  }

  public updateUnit(unit: UnitModel) {
    const unitIndex = this.units.findIndex((u) => u.getPosition().isEqual(unit.getPosition()));
    if (unitIndex === -1) return;

    this.units[unitIndex] = unit;

    const posKey = unit.getPosition().toString();
    this.unitMapByPos[posKey] = unit;
  }

  public removeUnit(position: PositionModel) {
    this.units = this.units.filter((u) => !u.getPosition().isEqual(position));
    const posKey = position.toString();
    delete this.unitMapByPos[posKey];
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
    handler(this.players);

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
}
