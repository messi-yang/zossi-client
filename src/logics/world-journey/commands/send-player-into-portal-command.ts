import { v4 as uuidv4 } from 'uuid';
import { PositionVo } from '@/models/world/common/position-vo';
import { Command } from './command';
import { DateVo } from '@/models/general/date-vo';
import { CommandParams } from './command-params';
import { PortalUnitModel } from '@/models/world/unit/portal-unit-model';

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
    return new SendPlayerIntoPortalCommand(uuidv4(), DateVo.now().getTimestamp(), playerId, position);
  }

  static load(id: string, timestamp: number, playerId: string, position: PositionVo) {
    return new SendPlayerIntoPortalCommand(id, timestamp, playerId, position);
  }

  public execute({ unitStorage, playerStorage }: CommandParams): void {
    const portalUnit = unitStorage.getUnit(this.position);
    if (!portalUnit || !(portalUnit instanceof PortalUnitModel)) return;

    const targetPosition = portalUnit.getTargetPosition();
    if (!targetPosition) return;

    const player = playerStorage.getPlayer(this.playerId);
    if (!player) return;

    player.updateAction(player.getAction().updatePosition(targetPosition).updateTime(DateVo.now()));
    player.updatePosition(targetPosition);
    playerStorage.updatePlayer(player);
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
