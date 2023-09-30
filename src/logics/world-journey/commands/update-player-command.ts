import { PlayerModel } from '@/models/world/player-model';
import { Command, Options } from '../command';

export class UpdatePlayerCommand implements Command {
  constructor(private player: PlayerModel) {}

  static new(player: PlayerModel) {
    return new UpdatePlayerCommand(player);
  }

  public execute({ playerStorage, itemStorage }: Options) {
    const updated = playerStorage.updatePlayer(this.player);
    if (!updated) return false;

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
