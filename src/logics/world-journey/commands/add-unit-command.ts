import { UnitModel } from '@/models/world/unit-model';
import { Command, Options } from '../command';

export class AddUnitCommand implements Command {
  constructor(private unit: UnitModel) {}

  static new(unit: UnitModel) {
    return new AddUnitCommand(unit);
  }

  public execute({ unitStorage }: Options): boolean {
    return unitStorage.addUnit(this.unit);
  }

  public getUnit() {
    return this.unit;
  }
}
