import { Command } from '../command';
import { DateVo } from '@/models/global/date-vo';
import { CommandParams } from '../command-params';
import { generateUuidV4 } from '@/utils/uuid';
import { CommandNameEnum } from '../command-name-enum';
import { PositionVo } from '@/models/world/common/position-vo';
import { PrecisePositionVo } from '@/models/world/common/precise-position-vo';
import { PlayerActionVo } from '@/models/world/player/player-action-vo';

export class TeleportPlayerCommand extends Command {
  constructor(id: string, createdAt: DateVo, isRemote: boolean, private playerId: string, private position: PositionVo) {
    super(CommandNameEnum.TeleportPlayer, id, createdAt, isRemote);
  }

  static create(playerId: string, position: PositionVo) {
    return new TeleportPlayerCommand(generateUuidV4(), DateVo.now(), false, playerId, position);
  }

  static createRemote(id: string, createdAt: DateVo, playerId: string, position: PositionVo) {
    return new TeleportPlayerCommand(id, createdAt, true, playerId, position);
  }

  public getIsClientOnly = () => true;

  public getRequiredItemId = () => null;

  public execute({ playerManager }: CommandParams): void {
    const currentPlayer = playerManager.getPlayer(this.playerId);
    if (!currentPlayer) return;

    const clonedPlayer = currentPlayer.clone();
    clonedPlayer.unfreeze();
    clonedPlayer.updateAction(PlayerActionVo.newTeleported(clonedPlayer.getDirection()));
    clonedPlayer.updatePrecisePosition(PrecisePositionVo.create(this.position.getX(), this.position.getZ()));

    const isPlayerUpdated = playerManager.updatePlayer(clonedPlayer);

    this.setUndoAction(() => {
      if (isPlayerUpdated) {
        playerManager.updatePlayer(currentPlayer);
      }
    });
  }

  public getPlayerId() {
    return this.playerId;
  }

  public getPosition() {
    return this.position;
  }
}
