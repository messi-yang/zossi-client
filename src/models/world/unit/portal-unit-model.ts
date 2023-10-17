import { DirectionModel } from '../common/direction-model';
import { PositionModel } from '../common/position-model';
import { UnitModel } from './unit-model';
import { UnitTypeEnum } from './unit-type-enum';
import { UnitTypeModel } from './unit-type-model';

export class PortalUnitModel implements UnitModel {
  private type: UnitTypeModel = UnitTypeModel.new(UnitTypeEnum.Portal);

  constructor(
    private itemId: string,
    private position: PositionModel,
    private direction: DirectionModel,
    private targetPosition: PositionModel | null
  ) {}

  static new = (
    itemId: string,
    position: PositionModel,
    direction: DirectionModel,
    targetPosition: PositionModel | null
  ): PortalUnitModel => new PortalUnitModel(itemId, position, direction, targetPosition);

  static mockup(): PortalUnitModel {
    return new PortalUnitModel(
      '414b5703-91d1-42fc-a007-36dd8f25e329',
      PositionModel.new(0, 0),
      DirectionModel.newDown(),
      null
    );
  }

  public clone(): PortalUnitModel {
    return new PortalUnitModel(this.itemId, this.position, this.direction, this.targetPosition);
  }

  public getType() {
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

  public getTargetPosition(): PositionModel | null {
    return this.targetPosition;
  }

  public updateTargetPosition(targetPosition: PositionModel | null) {
    this.targetPosition = targetPosition;
  }
}
