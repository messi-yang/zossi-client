import { Command, Options } from '../command';
import { PositionModel } from '@/models/world/position-model';

export class RotateUnitCommand implements Command {
  constructor(private position: PositionModel) {}

  static new(position: PositionModel) {
    return new RotateUnitCommand(position);
  }

  public execute({ unitStorage }: Options) {
    const unit = unitStorage.getUnit(this.position);
    if (!unit) return false;

    const clonedUnit = unit.clone();
    clonedUnit.updateDirection(clonedUnit.getDirection().rotate());

    return unitStorage.updateUnit(clonedUnit);
  }

  public getPosition() {
    return this.position;
  }
}
