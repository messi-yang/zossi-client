import { DirectionModel } from './direction-model';
import { PositionModel } from './position-model';
import { UnitTypeModel } from './unit-type-model';

export class UnitModel {
  constructor(
    private type: UnitTypeModel,
    private itemId: string,
    private position: PositionModel,
    private direction: DirectionModel
  ) {}

  static new = (type: UnitTypeModel, itemId: string, position: PositionModel, direction: DirectionModel): UnitModel =>
    new UnitModel(type, itemId, position, direction);

  static mockup(): UnitModel {
    return new UnitModel(
      UnitTypeModel.new('static'),
      '414b5703-91d1-42fc-a007-36dd8f25e329',
      PositionModel.new(0, 0),
      DirectionModel.newDown()
    );
  }

  public clone(): UnitModel {
    return new UnitModel(this.type, this.itemId, this.position, this.direction);
  }

  public getIdentifier(): string {
    return `${this.itemId},${this.position.getX()},${this.position.getZ()}`;
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
