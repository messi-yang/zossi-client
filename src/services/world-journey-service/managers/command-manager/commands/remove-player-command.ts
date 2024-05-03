import { BaseCommand } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/global/date-vo';
import { generateUuidV4 } from '@/utils/uuid';

export class RemovePlayerCommand extends BaseCommand {
  private playerId: string;

  constructor(id: string, timestamp: number, isRemote: boolean, playerId: string) {
    super(id, timestamp, isRemote);
    this.playerId = playerId;
  }

  static create(playerId: string) {
    return new RemovePlayerCommand(generateUuidV4(), DateVo.now().getTimestamp(), false, playerId);
  }

  static createRemote(id: string, timestamp: number, playerId: string) {
    return new RemovePlayerCommand(id, timestamp, true, playerId);
  }

  public getIsClientOnly = () => false;

  public getIsReplayable = () => false;

  public execute({ playerManager }: CommandParams): void {
    const currentPlayer = playerManager.getPlayer(this.playerId);
    if (!currentPlayer) return;

    const isPlayerRemoved = playerManager.removePlayer(this.playerId);

    this.setUndoAction(() => {
      if (isPlayerRemoved) {
        playerManager.addPlayer(currentPlayer);
      }
    });
  }

  public getPlayerId() {
    return this.playerId;
  }
}
