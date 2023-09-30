import { Command, Options } from './command';
import { PlayerModel } from '@/models/world/player-model';

export class AddPlayerCommand implements Command {
  constructor(private player: PlayerModel) {}

  static new(player: PlayerModel) {
    return new AddPlayerCommand(player);
  }

  public execute({ playerStorage, itemStorage }: Options) {
    const added = playerStorage.addPlayer(this.player);
    if (!added) return false;

    const playerHeldItemId = this.player.getHeldItemId();
    if (playerHeldItemId) {
      itemStorage.addPlaceholderItemId(playerHeldItemId);
    }
    return true;
  }

  public getPlayer() {
    return this.player;
  }
}
