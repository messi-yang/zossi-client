import { BaseCommand } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/global/date-vo';
import { PlayerActionVo } from '@/models/world/player/player-action-vo';
import { generateUuidV4 } from '@/utils/uuid';

export class ChangePlayerActionCommand extends BaseCommand {
  private playerId: string;

  private action: PlayerActionVo;

  constructor(id: string, timestamp: number, isRemote: boolean, playerId: string, action: PlayerActionVo) {
    super(id, timestamp, isRemote);
    this.playerId = playerId;
    this.action = action;
  }

  static create(playerId: string, action: PlayerActionVo) {
    return new ChangePlayerActionCommand(generateUuidV4(), DateVo.now().getTimestamp(), false, playerId, action);
  }

  static createRemote(id: string, timestamp: number, playerId: string, action: PlayerActionVo) {
    return new ChangePlayerActionCommand(id, timestamp, true, playerId, action);
  }

  public execute({ playerManager }: CommandParams): void {
    const player = playerManager.getPlayer(this.playerId);
    if (!player) return;

    const clonedPlayer = player.clone();
    clonedPlayer.updateAction(this.action);
    clonedPlayer.updatePrecisePosition(this.action.getPrecisePosition());
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

  public getAction() {
    return this.action;
  }
}
