import { Command } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/global/date-vo';
import { PortalUnitModel } from '@/models/world/unit/portal-unit-model';
import { generateUuidV4 } from '@/utils/uuid';

export class RemovePortalUnitCommand implements Command {
  private id: string;

  private timestamp: number;

  private unitId: string;

  constructor(id: string, timestamp: number, unitId: string) {
    this.id = id;
    this.timestamp = timestamp;
    this.unitId = unitId;
  }

  static new(unitId: string) {
    return new RemovePortalUnitCommand(generateUuidV4(), DateVo.now().getTimestamp(), unitId);
  }

  static load(id: string, timestamp: number, unitId: string) {
    return new RemovePortalUnitCommand(id, timestamp, unitId);
  }

  public execute({ unitManager }: CommandParams): void {
    const portalUnit = unitManager.getUnit(this.unitId);
    if (!portalUnit) return;

    if (!(portalUnit instanceof PortalUnitModel)) return;

    const targetPos = portalUnit.getTargetPosition();
    if (targetPos) {
      const targetPortalUnit = unitManager.getUnitByPos(targetPos);
      if (targetPortalUnit && targetPortalUnit instanceof PortalUnitModel) {
        targetPortalUnit.updateTargetPosition(null);
        unitManager.updateUnit(targetPortalUnit);
      }
    }

    unitManager.removeUnit(this.unitId);
  }

  public getId() {
    return this.id;
  }

  public getTimestamp() {
    return this.timestamp;
  }

  public getUnitId() {
    return this.unitId;
  }
}
