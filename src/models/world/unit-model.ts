import { DirectionModel } from './direction-model';
import { PositionModel } from './position-model';

export class UnitModel {
  constructor(private itemId: string, private position: PositionModel, private direction: DirectionModel) {}

  static new = (itemId: string, position: PositionModel, direction: DirectionModel): UnitModel =>
    new UnitModel(itemId, position, direction);

  static mockup(): UnitModel {
    return new UnitModel('414b5703-91d1-42fc-a007-36dd8f25e329', PositionModel.new(0, 0), DirectionModel.newDown());
  }

  public clone(): UnitModel {
    return new UnitModel(this.itemId, this.position, this.direction);
  }

  public getIdentifier(): string {
    return `${this.itemId},${this.position.getX()},${this.position.getZ()}`;
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
