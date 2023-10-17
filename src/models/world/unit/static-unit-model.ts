import { DirectionModel } from '../common/direction-model';
import { PositionModel } from '../common/position-model';
import { UnitModel } from './unit-model';
import { UnitTypeEnum } from './unit-type-enum';
import { UnitTypeModel } from './unit-type-model';

export class StaticUnitModel implements UnitModel {
  private type: UnitTypeModel = UnitTypeModel.new(UnitTypeEnum.Static);

  constructor(private itemId: string, private position: PositionModel, private direction: DirectionModel) {}

  static new = (itemId: string, position: PositionModel, direction: DirectionModel): StaticUnitModel =>
    new StaticUnitModel(itemId, position, direction);

  static mockup(): StaticUnitModel {
    return new StaticUnitModel(
      '414b5703-91d1-42fc-a007-36dd8f25e329',
      PositionModel.new(0, 0),
      DirectionModel.newDown()
    );
  }

  public clone(): StaticUnitModel {
    return new StaticUnitModel(this.itemId, this.position, this.direction);
  }

  public getType(): UnitTypeModel {
    return this.type;
  }

  public getItemId(): string {
    return this.itemId;
  }

  public getPosition(): PositionModel {
    return this.position;
  }

  public getDirection(): DirectionModel {
    return this.direction;
  }

  public changeDirection(direction: DirectionModel) {
    this.direction = direction;
  }
}
