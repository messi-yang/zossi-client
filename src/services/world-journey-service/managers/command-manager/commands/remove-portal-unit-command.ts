import { PositionVo } from '@/models/world/common/position-vo';
import { Command } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/global/date-vo';
import { PortalUnitModel } from '@/models/world/unit/portal-unit-model';
import { generateUuidV4 } from '@/utils/uuid';

export class RemovePortalUnitCommand implements Command {
  private id: string;

  private timestamp: number;

  private position: PositionVo;

  constructor(id: string, timestamp: number, position: PositionVo) {
    this.id = id;
    this.timestamp = timestamp;
    this.position = position;
  }

  static new(position: PositionVo) {
    return new RemovePortalUnitCommand(generateUuidV4(), DateVo.now().getTimestamp(), position);
  }

  static load(id: string, timestamp: number, position: PositionVo) {
    return new RemovePortalUnitCommand(id, timestamp, position);
  }

  public execute({ unitManager }: CommandParams): void {
    const portalUnit = unitManager.getUnit(this.position);
    if (!portalUnit) return;

    if (!(portalUnit instanceof PortalUnitModel)) return;

    const targetPos = portalUnit.getTargetPosition();
    if (targetPos) {
      const targetPortalUnit = unitManager.getUnit(targetPos);
      if (targetPortalUnit && targetPortalUnit instanceof PortalUnitModel) {
        targetPortalUnit.updateTargetPosition(null);
        unitManager.updateUnit(targetPortalUnit);
      }
    }

    unitManager.removeUnit(this.position);
  }

  public getId() {
    return this.id;
  }

  public getTimestamp() {
    return this.timestamp;
  }

  public getPosition() {
    return this.position;
  }
}
