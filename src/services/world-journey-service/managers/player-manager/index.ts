import { uniq } from 'lodash';
import { PlayerModel } from '@/models/world/player/player-model';
import { PositionVo } from '@/models/world/common/position-vo';

export type PlayersChangedHandler = (oldPlayers: PlayerModel[], newPlayers: PlayerModel[]) => void;
export type MyPlayerChangedHandler = (oldPlyaer: PlayerModel, player: PlayerModel) => void;

export class PlayerManager {
  private myPlayerId: string;

  private playerMap: Record<string, PlayerModel> = {};

  private playersMapByPos: Record<string, PlayerModel[] | undefined> = {};

  private playersChangedHandlers: PlayersChangedHandler[] = [];

  private myPlayerChangedHandlers: MyPlayerChangedHandler[] = [];

  constructor(players: PlayerModel[], myPlayerId: string) {
    this.myPlayerId = myPlayerId;

    this.playerMap = {};
    players.forEach((player) => {
      this.updatePlayerInPlayerMap(player);
    });

    this.playersMapByPos = {};
    players.forEach((player) => {
      this.addPlayerToPlayerMapByPos(player);
    });
  }

  static new(players: PlayerModel[], myPlayerId: string) {
    return new PlayerManager(players, myPlayerId);
  }

  public getAppearingItemIds(): string[] {
    const itemIds: string[] = [];

    this.getPlayers().forEach((p) => {
      const heldItemId = p.getHeldItemId();
      if (heldItemId) {
        itemIds.push(heldItemId);
      }
    });

    return uniq(itemIds);
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

  public addPlayer(player: PlayerModel): boolean {
    if (this.getPlayer(player.getId())) return false;

    this.addPlayerInPlayerMap(player);
    this.addPlayerToPlayerMapByPos(player);

    this.publishPlayersChanged(this.getPlayers());

    return true;
  }

  public updatePlayer(player: PlayerModel): boolean {
    const oldPlayer = this.getPlayer(player.getId());
    if (!oldPlayer) return false;

    this.updatePlayerInPlayerMap(player);
    this.updatePlayerInPlayerMapByPos(oldPlayer, player);

    this.publishPlayersChanged(this.getPlayers());

    if (this.isMyPlayer(player.getId())) {
      this.publishMyPlayerChanged(oldPlayer, this.getMyPlayer());
    }

    return true;
  }

  public removePlayer(playerId: string): boolean {
    const currentPlayer = this.getPlayer(playerId);
    if (!currentPlayer) return false;

    this.removePlayerFromPlayerMapByPos(currentPlayer);
    this.removePlayerFromPlayerMap(playerId);

    this.publishPlayersChanged(this.getPlayers());

    return true;
  }

  public getPlayersAtPos(pos: PositionVo): PlayerModel[] | null {
    return this.playersMapByPos[pos.toString()] || null;
  }

  public subscribePlayersChanged(handler: PlayersChangedHandler): () => void {
    this.playersChangedHandlers.push(handler);
    handler([], this.getPlayers());

    return () => {
      this.playersChangedHandlers = this.playersChangedHandlers.filter((hdl) => hdl !== handler);
    };
  }

  private publishPlayersChanged(players: PlayerModel[]) {
    this.playersChangedHandlers.forEach((hdl) => {
      hdl(this.getPlayers(), players);
    });
  }

  public subscribeMyPlayerChanged(handler: MyPlayerChangedHandler): () => void {
    this.myPlayerChangedHandlers.push(handler);
    handler(this.getMyPlayer(), this.getMyPlayer());

    return () => {
      this.myPlayerChangedHandlers = this.myPlayerChangedHandlers.filter((hdl) => hdl !== handler);
    };
  }

  private publishMyPlayerChanged(oldPlayer: PlayerModel, player: PlayerModel) {
    this.myPlayerChangedHandlers.forEach((hdl) => {
      hdl(oldPlayer, player);
    });
  }
}
