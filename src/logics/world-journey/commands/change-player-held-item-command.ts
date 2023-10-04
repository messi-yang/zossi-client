import { Command, Options } from '../command';

export class ChangePlayerHeldItemCommand implements Command {
  constructor(private playerId: string, private itemId: string) {}

  static new(playerId: string, itemId: string) {
    return new ChangePlayerHeldItemCommand(playerId, itemId);
  }

  public execute({ playerStorage, itemStorage }: Options) {
    const player = playerStorage.getPlayer(this.playerId);
    if (!player) return false;

    const clonedPlayer = player.clone();

    clonedPlayer.changeHeldItemId(this.itemId);
    if (this.itemId) {
      itemStorage.addPlaceholderItemId(this.itemId);
    }

    playerStorage.updatePlayer(clonedPlayer);
    return true;
  }

  public getPlayerId() {
    return this.playerId;
  }

  public getItemId() {
    return this.itemId;
  }
}
