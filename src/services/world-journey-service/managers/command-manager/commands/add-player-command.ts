import { BaseCommand } from '../command';
import { CommandParams } from '../command-params';
import { PlayerModel } from '@/models/world/player/player-model';
import { DateVo } from '@/models/global/date-vo';
import { generateUuidV4 } from '@/utils/uuid';

export class AddPlayerCommand extends BaseCommand {
  private player: PlayerModel;

  constructor(id: string, timestamp: number, isRemote: boolean, player: PlayerModel) {
    super(id, timestamp, isRemote);
    this.player = player;
  }

  static create(player: PlayerModel) {
    return new AddPlayerCommand(generateUuidV4(), DateVo.now().getTimestamp(), false, player);
  }

  static createRemote(id: string, timestamp: number, player: PlayerModel) {
    return new AddPlayerCommand(id, timestamp, true, player);
  }

  public getIsReplayable = () => false;

  public execute({ playerManager, itemManager }: CommandParams): void {
    const isPlayerAdded = playerManager.addPlayer(this.player);

    const playerHeldItemId = this.player.getHeldItemId();
    let isPlaceholderItemIdAdded = false;
    if (playerHeldItemId) {
      isPlaceholderItemIdAdded = itemManager.addPlaceholderItemId(playerHeldItemId);
    }

    this.setUndoAction(() => {
      if (isPlayerAdded) {
        playerManager.removePlayer(this.player.getId());
      }
      if (playerHeldItemId && isPlaceholderItemIdAdded) {
        itemManager.removePlaceholderItemId(playerHeldItemId);
      }
    });
  }

  public getPlayer() {
    return this.player;
  }
}
