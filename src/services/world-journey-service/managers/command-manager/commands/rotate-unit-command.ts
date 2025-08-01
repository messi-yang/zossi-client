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

  public getRequiredItemId = () => null;

  public execute({ unitManager }: CommandParams): boolean {
    const unit = unitManager.getUnit(this.unitId);
    if (!unit) return false;

    const clonedUnit = unit.clone();
    clonedUnit.rotate();

    const isUnitUpdated = unitManager.updateUnit(clonedUnit);
    if (!isUnitUpdated) return false;

    this.setUndoAction(() => {
      unitManager.updateUnit(unit);
    });

    return true;
  }

  public getUnitId() {
    return this.unitId;
  }
}
