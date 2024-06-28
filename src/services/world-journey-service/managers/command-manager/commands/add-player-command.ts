import { Command } from '../command';
import { CommandParams } from '../command-params';
import { PlayerModel } from '@/models/world/player/player-model';

export class AddPlayerCommand extends Command {
  private player: PlayerModel;

  constructor(id: string, timestamp: number, isRemote: boolean, player: PlayerModel) {
    super(id, timestamp, isRemote);
    this.player = player;
  }

  static createRemote(id: string, timestamp: number, player: PlayerModel) {
    return new AddPlayerCommand(id, timestamp, true, player);
  }

  public getIsClientOnly = () => true;

  public getIsReplayable = () => true;

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
