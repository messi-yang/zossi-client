import { PositionModel } from '@/models/world/position-model';
import { Command, Options } from '../command';

export class RemoveUnitCommand implements Command {
  constructor(private position: PositionModel) {}

  static new(position: PositionModel) {
    return new RemoveUnitCommand(position);
  }

  public execute({ unitStorage }: Options) {
    return unitStorage.removeUnit(this.position);
  }

  public getPosition() {
    return this.position;
  }
}
