import { BaseCommand } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/global/date-vo';
import { generateUuidV4 } from '@/utils/uuid';

export class ChangePlayerHeldItemCommand extends BaseCommand {
  private playerId: string;

  private itemId: string;

  constructor(id: string, timestamp: number, playerId: string, itemId: string) {
    super(id, timestamp);
    this.playerId = playerId;
    this.itemId = itemId;
  }

  static new(playerId: string, itemId: string) {
    return new ChangePlayerHeldItemCommand(generateUuidV4(), DateVo.now().getTimestamp(), playerId, itemId);
  }

  static load(id: string, timestamp: number, playerId: string, itemId: string) {
    return new ChangePlayerHeldItemCommand(id, timestamp, playerId, itemId);
  }

  public execute({ playerManager, itemManager }: CommandParams): void {
    const player = playerManager.getPlayer(this.playerId);
    if (!player) return;

    const clonedPlayer = player.clone();

    clonedPlayer.changeHeldItemId(this.itemId);
    if (this.itemId) {
      itemManager.addPlaceholderItemId(this.itemId);
    }

    const isPlayerUpdated = playerManager.updatePlayer(clonedPlayer);

    this.setUndoAction(() => {
      if (isPlayerUpdated) {
        playerManager.updatePlayer(player);
      }
    });
  }

  public getPlayerId() {
    return this.playerId;
  }

  public getItemId() {
    return this.itemId;
  }
}
