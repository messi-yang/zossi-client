import { UnitModel } from '@/models/world/unit-model';
import { Command, Options } from '../command';
import { PositionModel } from '@/models/world/position-model';
import { DirectionModel } from '@/models/world/direction-model';

export class CreatePortalUnitCommand implements Command {
  constructor(private itemId: string, private position: PositionModel, private direction: DirectionModel) {}

  static new(itemId: string, position: PositionModel, direction: DirectionModel) {
    return new CreatePortalUnitCommand(itemId, position, direction);
  }

  public execute({ unitStorage, itemStorage }: Options): boolean {
    const item = itemStorage.getItem(this.itemId);
    if (!item) return false;

    const unitAtPos = unitStorage.getUnit(this.position);
    if (unitAtPos) return false;

    return unitStorage.addUnit(UnitModel.new(this.itemId, this.position, this.direction));
  }

  public getItemId() {
    return this.itemId;
  }

  public getPosition() {
    return this.position;
  }

  public getDirection() {
    return this.direction;
  }
}
