import { v4 as uuidv4 } from 'uuid';
import { Command, Options } from '../command';
import { DateModel } from '@/models/general/date-model';

export class ChangePlayerHeldItemCommand implements Command {
  private id: string;

  private timestamp: number;

  private playerId: string;

  private itemId: string;

  constructor(id: string, timestamp: number, playerId: string, itemId: string) {
    this.id = id;
    this.timestamp = timestamp;
    this.playerId = playerId;
    this.itemId = itemId;
  }

  static new(playerId: string, itemId: string) {
    return new ChangePlayerHeldItemCommand(uuidv4(), DateModel.now().getTimestampe(), playerId, itemId);
  }

  static load(id: string, timestamp: number, playerId: string, itemId: string) {
    return new ChangePlayerHeldItemCommand(id, timestamp, playerId, itemId);
  }

  public execute({ playerStorage, itemStorage }: Options) {
    const player = playerStorage.getPlayer(this.playerId);
    if (!player) return false;

    const clonedPlayer = player.clone();

    clonedPlayer.changeHeldItemId(this.itemId);
    if (this.itemId) {
      itemStorage.addPlaceholderItemId(this.itemId);
    }

    playerStorage.updatePlayer(clonedPlayer);
    return true;
  }

  public getId() {
    return this.id;
  }

  public getTimestampe() {
    return this.timestamp;
  }

  public getPlayerId() {
    return this.playerId;
  }

  public getItemId() {
    return this.itemId;
  }
}
