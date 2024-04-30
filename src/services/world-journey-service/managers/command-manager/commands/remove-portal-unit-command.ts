import { BaseCommand } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/global/date-vo';
import { PortalUnitModel } from '@/models/world/unit/portal-unit-model';
import { generateUuidV4 } from '@/utils/uuid';

export class RemovePortalUnitCommand extends BaseCommand {
  private unitId: string;

  constructor(id: string, timestamp: number, isRemote: boolean, unitId: string) {
    super(id, timestamp, isRemote);
    this.unitId = unitId;
  }

  static create(unitId: string) {
    return new RemovePortalUnitCommand(generateUuidV4(), DateVo.now().getTimestamp(), false, unitId);
  }

  static createRemote(id: string, timestamp: number, unitId: string) {
    return new RemovePortalUnitCommand(id, timestamp, true, unitId);
  }

  public getIsReplayable = () => true;

  public execute({ unitManager }: CommandParams): void {
    const portalUnit = unitManager.getUnit(this.unitId);
    if (!portalUnit) return;

    if (!(portalUnit instanceof PortalUnitModel)) return;

    const targetUnitId = portalUnit.getTargetUnitId();
    let targetPortalUnit: PortalUnitModel | null = null;
    let isTargetPortalUnitUpdated = false;
    if (targetUnitId) {
      const targetUnit = unitManager.getUnit(targetUnitId);
      if (targetUnit) {
        if (targetUnit instanceof PortalUnitModel) {
          targetPortalUnit = targetUnit;
          const clonedTargetPortalUnit = targetPortalUnit.clone();
          clonedTargetPortalUnit.updateTargetUnitId(null);
          isTargetPortalUnitUpdated = unitManager.updateUnit(clonedTargetPortalUnit);
        }
      }
    }

    const isUnitRemoved = unitManager.removeUnit(this.unitId);

    this.setUndoAction(() => {
      if (isUnitRemoved) {
        unitManager.addUnit(portalUnit);
      }
      if (isTargetPortalUnitUpdated && targetPortalUnit) {
        unitManager.updateUnit(targetPortalUnit);
      }
    });
  }

  public getUnitId() {
    return this.unitId;
  }
}
