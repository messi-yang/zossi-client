import { v4 as uuidv4 } from 'uuid';
import { Command } from './command';
import { CommandParams } from './command-params';
import { PositionModel } from '@/models/world/common/position-model';
import { DateModel } from '@/models/general/date-model';

export class RotateUnitCommand implements Command {
  private id: string;

  private timestamp: number;

  private position: PositionModel;

  constructor(id: string, timestamp: number, position: PositionModel) {
    this.id = id;
    this.timestamp = timestamp;
    this.position = position;
  }

  static new(position: PositionModel) {
    return new RotateUnitCommand(uuidv4(), DateModel.now().getTimestamp(), position);
  }

  static load(id: string, timestamp: number, position: PositionModel) {
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
