import { Command } from '../command';
import { CommandNameEnum } from '../command-name-enum';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/global/date-vo';
import { generateUuidV4 } from '@/utils/uuid';

export class RotateUnitCommand extends Command {
  private unitId: string;

  constructor(id: string, createdAt: DateVo, isRemote: boolean, unitId: string) {
    super(CommandNameEnum.RotateUnit, id, createdAt, isRemote);
    this.unitId = unitId;
  }

  static create(unitId: string) {
    return new RotateUnitCommand(generateUuidV4(), DateVo.now(), false, unitId);
  }

  static createRemote(id: string, createdAt: DateVo, unitId: string) {
    return new RotateUnitCommand(id, createdAt, true, unitId);
  }

  public getIsClientOnly = () => false;

  public execute({ unitManager }: CommandParams): void {
    const unit = unitManager.getUnit(this.unitId);
    if (!unit) return;

    const clonedUnit = unit.clone();
    clonedUnit.rotate();

    const isUnitUpdated = unitManager.updateUnit(clonedUnit);

    this.setUndoAction(() => {
      if (isUnitUpdated) {
        unitManager.updateUnit(unit);
      }
    });
  }

  public getUnitId() {
    return this.unitId;
  }
}
