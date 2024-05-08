import { uniq } from 'lodash';
import { PlayerModel } from '@/models/world/player/player-model';
import { PositionVo } from '@/models/world/common/position-vo';
import { EventHandler, EventHandlerSubscriber } from '@/services/world-journey-service/managers/common/event-handler';

export type PlayersChangedHandler = (oldPlayers: PlayerModel[], newPlayers: PlayerModel[]) => void;
export type PlayerUpdatedEventListener = (oldPlyaer: PlayerModel, player: PlayerModel) => void;
export class PlayerManager {
  private myPlayerId: string;

  private playerMap: Record<string, PlayerModel | undefined> = {};

  private playersMapByPos: Record<string, PlayerModel[] | undefined> = {};

  private playerAddedEventHandler = EventHandler.create<PlayerModel>();

  private playerUpdatedEventHandler = EventHandler.create<[oldPlayer: PlayerModel, newPlayer: PlayerModel]>();

  private playerRemovedEventHandler = EventHandler.create<PlayerModel>();

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

  static create(players: PlayerModel[], myPlayerId: string) {
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
    const players: PlayerModel[] = [];
    Object.values(this.playerMap).forEach((player) => {
      if (player) players.push(player);
    });
    return players;
  }

  public getMyPlayerId(): string {
    return this.myPlayerId;
  }

  public getMyPlayer(): PlayerModel {
    const myPlayer = this.playerMap[this.myPlayerId];
    if (!myPlayer) throw new Error('My player will never be undefined');

    return myPlayer;
  }

  public getOtherPlayers(): PlayerModel[] {
    const players: PlayerModel[] = [];
    Object.values(this.playerMap).forEach((player) => {
      if (player) players.push(player);
    });
    return players.filter((p) => p.getId() !== this.myPlayerId);
  }

  public getPlayer(playerId: string): PlayerModel | null {
    return this.playerMap[playerId] ?? null;
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

  /**
   * Add the player
   * @returns isStateChanged
   */
  public addPlayer(player: PlayerModel): boolean {
    if (this.getPlayer(player.getId())) return false;

    this.addPlayerInPlayerMap(player);
    this.addPlayerToPlayerMapByPos(player);

    this.publishPlayerAddedEvent(player);

    return true;
  }

  /**
   * Update the player
   * @returns isStateChanged
   */
  public updatePlayer(player: PlayerModel): boolean {
    const oldPlayer = this.getPlayer(player.getId());
    if (!oldPlayer) return false;

    this.updatePlayerInPlayerMap(player);
    this.updatePlayerInPlayerMapByPos(oldPlayer, player);

    this.publishPlayerUpdatedEvent(oldPlayer, player);

    return true;
  }

  /**
   * Remove the player
   * @returns isStateChanged
   */
  public removePlayer(playerId: string): boolean {
    const currentPlayer = this.getPlayer(playerId);
    if (!currentPlayer) return false;

    this.removePlayerFromPlayerMapByPos(currentPlayer);
    this.removePlayerFromPlayerMap(playerId);

    this.publishPlayerRemovedEvent(currentPlayer);

    return true;
  }

  public getPlayersAtPos(pos: PositionVo): PlayerModel[] | null {
    return this.playersMapByPos[pos.toString()] || null;
  }

  private publishPlayerAddedEvent(player: PlayerModel) {
    this.playerAddedEventHandler.publish(player);
  }

  public subscribePlayerAddedEvent(subscriber: EventHandlerSubscriber<PlayerModel>) {
    return this.playerAddedEventHandler.subscribe(subscriber);
  }

  private publishPlayerUpdatedEvent(oldPlayer: PlayerModel, newPlayer: PlayerModel) {
    this.playerUpdatedEventHandler.publish([oldPlayer, newPlayer]);
  }

  public subscribePlayerUpdatedEvent(subscriber: EventHandlerSubscriber<[PlayerModel, PlayerModel]>) {
    return this.playerUpdatedEventHandler.subscribe(subscriber);
  }

  private publishPlayerRemovedEvent(player: PlayerModel) {
    this.playerRemovedEventHandler.publish(player);
  }

  public subscribePlayerRemovedEvent(subscriber: EventHandlerSubscriber<PlayerModel>) {
    return this.playerRemovedEventHandler.subscribe(subscriber);
  }
}
