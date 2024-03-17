import { BaseCommand } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/global/date-vo';
import { generateUuidV4 } from '@/utils/uuid';

export class RemovePlayerCommand extends BaseCommand {
  private playerId: string;

  constructor(id: string, timestamp: number, playerId: string) {
    super(id, timestamp);
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

  public getPlayerId() {
    return this.playerId;
  }
}
