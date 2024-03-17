import { BaseCommand } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/global/date-vo';
import { generateUuidV4 } from '@/utils/uuid';

export class RotateUnitCommand extends BaseCommand {
  private unitId: string;

  constructor(id: string, timestamp: number, unitId: string) {
    super(id, timestamp);
    this.unitId = unitId;
  }

  static new(unitId: string) {
    return new RotateUnitCommand(generateUuidV4(), DateVo.now().getTimestamp(), unitId);
  }

  static load(id: string, timestamp: number, unitId: string) {
    return new RotateUnitCommand(id, timestamp, unitId);
  }

  public execute({ unitManager }: CommandParams): void {
    const unit = unitManager.getUnit(this.unitId);
    if (!unit) return;

    const clonedUnit = unit.clone();
    clonedUnit.changeDirection(clonedUnit.getDirection().rotate());

    unitManager.updateUnit(clonedUnit);
  }

  public getUnitId() {
    return this.unitId;
  }
}
