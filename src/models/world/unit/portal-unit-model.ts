import { DirectionVo } from '../common/direction-vo';
import { PositionVo } from '../common/position-vo';
import { UnitModel } from './unit-model';
import { UnitTypeEnum } from './unit-type-enum';

export class PortalUnitModel implements UnitModel {
  constructor(
    private itemId: string,
    private position: PositionVo,
    private direction: DirectionVo,
    private targetPosition: PositionVo | null
  ) {}

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
    return new PortalUnitModel(this.itemId, this.position, this.direction, this.targetPosition);
  }

  public getType(): UnitTypeEnum.Portal {
    return UnitTypeEnum.Portal;
  }

  public getItemId(): string {
    return this.itemId;
  }

  public getPosition(): PositionVo {
    return this.position;
  }

  public getDirection(): DirectionVo {
    return this.direction;
  }

  public changeDirection(direction: DirectionVo) {
    this.direction = direction;
  }

  public getTargetPosition(): PositionVo | null {
    return this.targetPosition;
  }

  public updateTargetPosition(targetPosition: PositionVo | null) {
    this.targetPosition = targetPosition;
  }
}
