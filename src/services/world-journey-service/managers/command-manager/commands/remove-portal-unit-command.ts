import { Command } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/global/date-vo';
import { PortalUnitModel } from '@/models/world/unit/portal-unit-model';
import { generateUuidV4 } from '@/utils/uuid';
import { CommandNameEnum } from '../command-name-enum';

export class RemovePortalUnitCommand extends Command {
  private unitId: string;

  constructor(id: string, createdAt: DateVo, isRemote: boolean, unitId: string) {
    super(CommandNameEnum.RemovePortalUnit, id, createdAt, isRemote);
    this.unitId = unitId;
  }

  static create(unitId: string) {
    return new RemovePortalUnitCommand(generateUuidV4(), DateVo.now(), false, unitId);
  }

  static createRemote(id: string, createdAt: DateVo, unitId: string) {
    return new RemovePortalUnitCommand(id, createdAt, true, unitId);
  }

  public getIsClientOnly = () => false;

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
