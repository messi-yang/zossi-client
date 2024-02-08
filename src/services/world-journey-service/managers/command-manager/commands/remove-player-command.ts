import { Command } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/global/date-vo';
import { generateUuidV4 } from '@/utils/uuid';

export class RemovePlayerCommand implements Command {
  private id: string;

  private timestamp: number;

  private playerId: string;

  constructor(id: string, timestamp: number, playerId: string) {
    this.id = id;
    this.timestamp = timestamp;
    this.playerId = playerId;
  }

  static new(playerId: string) {
    return new RemovePlayerCommand(generateUuidV4(), DateVo.now().getTimestamp(), playerId);
  }

  static load(id: string, timestamp: number, playerId: string) {
    return new RemovePlayerCommand(id, timestamp, playerId);
  }

  public execute({ playerManager }: CommandParams): void {
    playerManager.removePlayer(this.playerId);
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
}
