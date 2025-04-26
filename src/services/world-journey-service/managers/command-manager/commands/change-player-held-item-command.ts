import { Command } from '../command';
import { CommandNameEnum } from '../command-name-enum';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/global/date-vo';
import { generateUuidV4 } from '@/utils/uuid';

export class ChangePlayerHeldItemCommand extends Command {
  private playerId: string;

  private itemId: string | null;

  constructor(id: string, createdAt: DateVo, isRemote: boolean, playerId: string, itemId: string | null) {
    super(CommandNameEnum.ChangePlayerHeldItem, id, createdAt, isRemote);
    this.playerId = playerId;
    this.itemId = itemId;
  }

  static create(playerId: string, itemId: string | null) {
    return new ChangePlayerHeldItemCommand(generateUuidV4(), DateVo.now(), false, playerId, itemId);
  }

  static createRemote(id: string, createdAt: DateVo, playerId: string, itemId: string | null) {
    return new ChangePlayerHeldItemCommand(id, createdAt, true, playerId, itemId);
  }

  public getIsClientOnly = () => true;

  public getRequiredItemId = () => this.itemId;

  public execute({ playerManager }: CommandParams): void {
    const player = playerManager.getPlayer(this.playerId);
    if (!player) return;

    const clonedPlayer = player.clone();

    clonedPlayer.changeHeldItemId(this.itemId);

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
