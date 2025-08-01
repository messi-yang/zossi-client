import { Command } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/global/date-vo';
import { PlayerActionVo } from '@/models/world/player/player-action-vo';
import { generateUuidV4 } from '@/utils/uuid';
import { CommandNameEnum } from '../command-name-enum';

export class ChangePlayerActionCommand extends Command {
  private playerId: string;

  private action: PlayerActionVo;

  constructor(id: string, createdAt: DateVo, isRemote: boolean, playerId: string, action: PlayerActionVo) {
    super(CommandNameEnum.ChangePlayerAction, id, createdAt, isRemote);
    this.playerId = playerId;
    this.action = action;
  }

  static create(playerId: string, action: PlayerActionVo) {
    return new ChangePlayerActionCommand(generateUuidV4(), DateVo.now(), false, playerId, action);
  }

  static createRemote(id: string, createdAt: DateVo, playerId: string, action: PlayerActionVo) {
    return new ChangePlayerActionCommand(id, createdAt, true, playerId, action);
  }

  public getIsClientOnly = () => true;

  public getRequiredItemId = () => null;

  public execute({ playerManager }: CommandParams): boolean {
    const player = playerManager.getPlayer(this.playerId);
    if (!player) return false;

    const clonedPlayer = player.clone();
    clonedPlayer.updateAction(this.action);
    const isPlayerUpdated = playerManager.updatePlayer(clonedPlayer);
    if (!isPlayerUpdated) return false;

    this.setUndoAction(() => {
      playerManager.updatePlayer(player);
    });

    return true;
  }

  public getPlayerId() {
    return this.playerId;
  }

  public getAction() {
    return this.action;
  }
}
