import { Command } from '../command';
import { CommandParams } from '../command-params';
import { DateVo } from '@/models/global/date-vo';
import { generateUuidV4 } from '@/utils/uuid';

export class RotateUnitCommand implements Command {
  private id: string;

  private timestamp: number;

  private unitId: string;

  constructor(id: string, timestamp: number, unitId: string) {
    this.id = id;
    this.timestamp = timestamp;
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
