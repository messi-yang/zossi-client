import { Command } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/global/date-vo';
import { PrecisePositionVo } from '@/models/world/common/precise-position-vo';
import { generateUuidV4 } from '@/utils/uuid';

export class ChangePlayerPrecisePositionCommand extends Command {
  private playerId: string;

  private precisePosition: PrecisePositionVo;

  constructor(id: string, timestamp: number, isRemote: boolean, playerId: string, precisePosition: PrecisePositionVo) {
    super(id, timestamp, isRemote);
    this.playerId = playerId;
    this.precisePosition = precisePosition;
  }

  static create(playerId: string, precisePosition: PrecisePositionVo) {
    return new ChangePlayerPrecisePositionCommand(generateUuidV4(), DateVo.now().getTimestamp(), false, playerId, precisePosition);
  }

  static createRemote(id: string, timestamp: number, playerId: string, precisePosition: PrecisePositionVo) {
    return new ChangePlayerPrecisePositionCommand(id, timestamp, true, playerId, precisePosition);
  }

  public getIsClientOnly = () => true;

  public getIsReplayable = () => false;

  public execute({ playerManager }: CommandParams): void {
    const player = playerManager.getPlayer(this.playerId);
    if (!player) return;

    const clonedPlayer = player.clone();
    clonedPlayer.updatePrecisePosition(this.precisePosition);
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

  public getPrecisePosition() {
    return this.precisePosition;
  }
}
