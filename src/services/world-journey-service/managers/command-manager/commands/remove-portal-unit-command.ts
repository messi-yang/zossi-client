import { BaseCommand } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/global/date-vo';
import { PortalUnitModel } from '@/models/world/unit/portal-unit-model';
import { generateUuidV4 } from '@/utils/uuid';

export class RemovePortalUnitCommand extends BaseCommand {
  private unitId: string;

  constructor(id: string, timestamp: number, unitId: string) {
    super(id, timestamp);
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

    const targetUnitId = portalUnit.getTargetUnitId();
    if (targetUnitId) {
      const targetPortalUnit = unitManager.getUnit(targetUnitId);
      if (targetPortalUnit && targetPortalUnit instanceof PortalUnitModel) {
        targetPortalUnit.updateTargetUnitId(null);
        unitManager.updateUnit(targetPortalUnit);
      }
    }

    unitManager.removeUnit(this.unitId);
  }

  public getUnitId() {
    return this.unitId;
  }
}
