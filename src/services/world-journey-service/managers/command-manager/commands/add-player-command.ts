import { DateVo } from '@/models/global/date-vo';
import { Command } from '../command';
import { CommandParams } from '../command-params';
import { PlayerModel } from '@/models/world/player/player-model';
import { CommandNameEnum } from '../command-name-enum';

export class AddPlayerCommand extends Command {
  private player: PlayerModel;

  constructor(id: string, createdAt: DateVo, isRemote: boolean, player: PlayerModel) {
    super(CommandNameEnum.AddPlayer, id, createdAt, isRemote);
    this.player = player;
  }

  static createRemote(id: string, createdAt: DateVo, player: PlayerModel) {
    return new AddPlayerCommand(id, createdAt, true, player);
  }

  public getIsClientOnly = () => true;

  public getRequiredItemId = () => this.player.getHeldItemId();

  public execute({ playerManager }: CommandParams): boolean {
    const isPlayerAdded = playerManager.addPlayer(this.player);
    if (!isPlayerAdded) return false;

    this.setUndoAction(() => {
      playerManager.removePlayer(this.player.getId());
    });
    return true;
  }

  public getPlayer() {
    return this.player;
  }
}
