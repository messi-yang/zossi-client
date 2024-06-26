import { BaseCommand } from '../command';
import { CommandParams } from '../command-params';

export class RemovePlayerCommand extends BaseCommand {
  private playerId: string;

  constructor(id: string, timestamp: number, isRemote: boolean, playerId: string) {
    super(id, timestamp, isRemote);
    this.playerId = playerId;
  }

  static createRemote(id: string, timestamp: number, playerId: string) {
    return new RemovePlayerCommand(id, timestamp, true, playerId);
  }

  public getIsClientOnly = () => true;

  public getIsReplayable = () => true;

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
