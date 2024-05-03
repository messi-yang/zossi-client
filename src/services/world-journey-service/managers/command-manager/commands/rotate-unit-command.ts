import { BaseCommand } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/global/date-vo';
import { generateUuidV4 } from '@/utils/uuid';

export class RotateUnitCommand extends BaseCommand {
  private unitId: string;

  constructor(id: string, timestamp: number, isRemote: boolean, unitId: string) {
    super(id, timestamp, isRemote);
    this.unitId = unitId;
  }

  static create(unitId: string) {
    return new RotateUnitCommand(generateUuidV4(), DateVo.now().getTimestamp(), false, unitId);
  }

  static createRemote(id: string, timestamp: number, unitId: string) {
    return new RotateUnitCommand(id, timestamp, true, unitId);
  }

  public getIsClientOnly = () => false;

  public getIsReplayable = () => true;

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
