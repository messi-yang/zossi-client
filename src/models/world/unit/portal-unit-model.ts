import { DirectionVo } from '../common/direction-vo';
import { PositionVo } from '../common/position-vo';
import { BaseUnitModel, UnitModel } from './unit-model';
import { UnitTypeEnum } from './unit-type-enum';

export class PortalUnitModel extends BaseUnitModel implements UnitModel {
  constructor(itemId: string, position: PositionVo, direction: DirectionVo, private targetPosition: PositionVo | null) {
    super(itemId, position, direction);
  }

  static new = (
    itemId: string,
    position: PositionVo,
    direction: DirectionVo,
    targetPosition: PositionVo | null
  ): PortalUnitModel => new PortalUnitModel(itemId, position, direction, targetPosition);

  static mockup(): PortalUnitModel {
    return new PortalUnitModel(
      '414b5703-91d1-42fc-a007-36dd8f25e329',
      PositionVo.new(0, 0),
      DirectionVo.newDown(),
      null
    );
  }

  public clone(): PortalUnitModel {
    return new PortalUnitModel(this.getItemId(), this.getPosition(), this.getDirection(), this.targetPosition);
  }

  public getType(): UnitTypeEnum.Portal {
    return UnitTypeEnum.Portal;
  }

  public getTargetPosition(): PositionVo | null {
    return this.targetPosition;
  }

  public updateTargetPosition(targetPosition: PositionVo | null) {
    this.targetPosition = targetPosition;
  }
}
