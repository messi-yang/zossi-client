import { v4 as uuidv4 } from 'uuid';
import { Command, Options } from '../command';
import { PositionModel } from '@/models/world/position-model';
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
    return new RotateUnitCommand(uuidv4(), DateModel.now().getTimestampe(), position);
  }

  static load(id: string, timestamp: number, position: PositionModel) {
    return new RotateUnitCommand(id, timestamp, position);
  }

  public execute({ unitStorage }: Options) {
    const unit = unitStorage.getUnit(this.position);
    if (!unit) return false;

    const clonedUnit = unit.clone();
    clonedUnit.changeDirection(clonedUnit.getDirection().rotate());

    return unitStorage.updateUnit(clonedUnit);
  }

  public getId() {
    return this.id;
  }

  public getTimestampe() {
    return this.timestamp;
  }

  public getPosition() {
    return this.position;
  }
}
