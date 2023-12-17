import { v4 as uuidv4 } from 'uuid';
import { Command } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/general/date-vo';

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
    return new ChangePlayerHeldItemCommand(uuidv4(), DateVo.now().getTimestamp(), playerId, itemId);
  }

  static load(id: string, timestamp: number, playerId: string, itemId: string) {
    return new ChangePlayerHeldItemCommand(id, timestamp, playerId, itemId);
  }

  public execute({ playerManager, itemManager }: CommandParams): void {
    const player = playerManager.getPlayer(this.playerId);
    if (!player) return;

    const clonedPlayer = player.clone();

    clonedPlayer.changeHeldItemId(this.itemId);
    if (this.itemId) {
      itemManager.addPlaceholderItemId(this.itemId);
    }

    playerManager.updatePlayer(clonedPlayer);
  }

  public getId() {
    return this.id;
  }

  public getTimestamp() {
    return this.timestamp;
  }

  public getPlayerId() {
    return this.playerId;
  }

  public getItemId() {
    return this.itemId;
  }
}
