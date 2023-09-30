import { UnitModel } from '@/models/world/unit-model';
import { Command, Options } from '../command';

export class UpdateUnitCommand implements Command {
  constructor(private unit: UnitModel) {}

  static new(unit: UnitModel) {
    return new UpdateUnitCommand(unit);
  }

  public execute({ unitStorage }: Options) {
    return unitStorage.updateUnit(this.unit);
  }

  public getUnit() {
    return this.unit;
  }
}
