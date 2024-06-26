import { DateVo } from '@/models/global/date-vo';
import { Command } from '../command';
import { CommandParams } from '../command-params';

export class RemovePlayerCommand extends Command {
  private playerId: string;

  constructor(id: string, createdAt: DateVo, isRemote: boolean, playerId: string) {
    super(id, createdAt, isRemote);
    this.playerId = playerId;
  }

  static createRemote(id: string, createdAt: DateVo, playerId: string) {
    return new RemovePlayerCommand(id, createdAt, true, playerId);
  }

  public getIsClientOnly = () => true;

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
