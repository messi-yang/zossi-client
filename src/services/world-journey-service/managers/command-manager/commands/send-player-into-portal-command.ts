import { PositionVo } from '@/models/world/common/position-vo';
import { Command } from '../command';
import { DateVo } from '@/models/global/date-vo';
import { CommandParams } from '../command-params';
import { PortalUnitModel } from '@/models/world/unit/portal-unit-model';
import { PrecisePositionVo } from '@/models/world/common/precise-position-vo';
import { generateUuidV4 } from '@/utils/uuid';

export class SendPlayerIntoPortalCommand implements Command {
  private id: string;

  private timestamp: number;

  private playerId: string;

  private position: PositionVo;

  constructor(id: string, timestamp: number, playerId: string, position: PositionVo) {
    this.id = id;
    this.timestamp = timestamp;
    this.playerId = playerId;
    this.position = position;
  }

  static new(playerId: string, position: PositionVo) {
    return new SendPlayerIntoPortalCommand(generateUuidV4(), DateVo.now().getTimestamp(), playerId, position);
  }

  static load(id: string, timestamp: number, playerId: string, position: PositionVo) {
    return new SendPlayerIntoPortalCommand(id, timestamp, playerId, position);
  }

  public execute({ unitManager, playerManager }: CommandParams): void {
    const portalUnit = unitManager.getUnit(this.position);
    if (!portalUnit || !(portalUnit instanceof PortalUnitModel)) return;

    const targetPosition = portalUnit.getTargetPosition();
    if (!targetPosition) return;

    const player = playerManager.getPlayer(this.playerId);
    if (!player) return;

    const nextPlayerPrecisePosition = PrecisePositionVo.new(targetPosition.getX(), targetPosition.getZ());
    player.updateAction(player.getAction().updatePrecisePosition(nextPlayerPrecisePosition).updateTime(DateVo.now()));
    player.updatePrecisePosition(nextPlayerPrecisePosition);
    playerManager.updatePlayer(player);
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

  public getPosition() {
    return this.position;
  }
}
