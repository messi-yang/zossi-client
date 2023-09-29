import { uniq } from 'lodash';
import { PlayerModel } from '@/models/world/player-model';
import { PositionModel } from '@/models/world/position-model';

type PlayersChangedHandler = (players: PlayerModel[]) => void;
type MyPlayerChangedHandler = (player: PlayerModel) => void;

export class PlayerStorage {
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
    return new PlayerStorage(players, myPlayerId);
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

  public getPlayersAtPos(pos: PositionModel): PlayerModel[] | null {
    return this.playersMapByPos[pos.toString()] || null;
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
}
