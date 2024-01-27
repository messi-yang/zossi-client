import { Command } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/general/date-vo';
import { PlayerActionVo } from '@/models/world/player/player-action-vo';
import { generateUuidV4 } from '@/utils/uuid';

export class ChangePlayerActionCommand implements Command {
  private id: string;

  private timestamp: number;

  private playerId: string;

  private action: PlayerActionVo;

  constructor(id: string, timestamp: number, playerId: string, action: PlayerActionVo) {
    this.id = id;
    this.timestamp = timestamp;
    this.playerId = playerId;
    this.action = action;
  }

  static new(playerId: string, action: PlayerActionVo) {
    return new ChangePlayerActionCommand(generateUuidV4(), DateVo.now().getTimestamp(), playerId, action);
  }

  static load(id: string, timestamp: number, playerId: string, action: PlayerActionVo) {
    return new ChangePlayerActionCommand(id, timestamp, playerId, action);
  }

  public execute({ playerManager }: CommandParams): void {
    const player = playerManager.getPlayer(this.playerId);
    if (!player) return;

    const clonedPlayer = player.clone();
    clonedPlayer.updateAction(this.action);
    clonedPlayer.updatePrecisePosition(this.action.getPrecisePosition());
    playerManager.updatePlayer(clonedPlayer);
  }

  public getId() {
    return this.id;
  }

  public getTimestamp() {
    return this.timestamp;
  }

  public getPlayerId() {
    return this.playerId;
  }

  public getAction() {
    return this.action;
  }
}
