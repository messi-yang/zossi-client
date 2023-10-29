import { v4 as uuidv4 } from 'uuid';
import { Command } from './command';
import { CommandParams } from './command-params';
import { PositionVo } from '@/models/world/common/position-vo';
import { DateVo } from '@/models/general/date-vo';

export class RotateUnitCommand implements Command {
  private id: string;

  private timestamp: number;

  private position: PositionVo;

  constructor(id: string, timestamp: number, position: PositionVo) {
    this.id = id;
    this.timestamp = timestamp;
    this.position = position;
  }

  static new(position: PositionVo) {
    return new RotateUnitCommand(uuidv4(), DateVo.now().getTimestamp(), position);
  }

  static load(id: string, timestamp: number, position: PositionVo) {
    return new RotateUnitCommand(id, timestamp, position);
  }

  public execute({ unitStorage }: CommandParams): void {
    const unit = unitStorage.getUnit(this.position);
    if (!unit) return;

    const clonedUnit = unit.clone();
    clonedUnit.changeDirection(clonedUnit.getDirection().rotate());

    unitStorage.updateUnit(clonedUnit);
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
