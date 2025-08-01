import { DateVo } from '@/models/global/date-vo';
import { Command } from '../command';
import { CommandParams } from '../command-params';
import { CommandNameEnum } from '../command-name-enum';

export class RemovePlayerCommand extends Command {
  private playerId: string;

  constructor(id: string, createdAt: DateVo, isRemote: boolean, playerId: string) {
    super(CommandNameEnum.RemovePlayer, id, createdAt, isRemote);
    this.playerId = playerId;
  }

  static createRemote(id: string, createdAt: DateVo, playerId: string) {
    return new RemovePlayerCommand(id, createdAt, true, playerId);
  }

  public getIsClientOnly = () => true;

  public getRequiredItemId = () => null;

  public execute({ playerManager }: CommandParams): boolean {
    const currentPlayer = playerManager.getPlayer(this.playerId);
    if (!currentPlayer) return false;

    const isPlayerRemoved = playerManager.removePlayer(this.playerId);
    if (!isPlayerRemoved) return false;

    this.setUndoAction(() => {
      playerManager.addPlayer(currentPlayer);
    });

    return true;
  }

  public getPlayerId() {
    return this.playerId;
  }
}
