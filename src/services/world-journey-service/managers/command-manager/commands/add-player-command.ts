import { DateVo } from '@/models/global/date-vo';
import { Command } from '../command';
import { CommandParams } from '../command-params';
import { PlayerModel } from '@/models/world/player/player-model';

export class AddPlayerCommand extends Command {
  private player: PlayerModel;

  constructor(id: string, createdAt: DateVo, isRemote: boolean, player: PlayerModel) {
    super(id, createdAt, isRemote);
    this.player = player;
  }

  static createRemote(id: string, createdAt: DateVo, player: PlayerModel) {
    return new AddPlayerCommand(id, createdAt, true, player);
  }

  public getIsClientOnly = () => true;

  public execute({ playerManager }: CommandParams): void {
    const isPlayerAdded = playerManager.addPlayer(this.player);

    this.setUndoAction(() => {
      if (isPlayerAdded) {
        playerManager.removePlayer(this.player.getId());
      }
    });
  }

  public getPlayer() {
    return this.player;
  }
}
