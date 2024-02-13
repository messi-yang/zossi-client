import { generateUuidV4 } from '@/utils/uuid';
import { DirectionVo } from '../common/direction-vo';
import { PositionVo } from '../common/position-vo';
import { BaseUnitModel, UnitModel } from './unit-model';
import { UnitTypeEnum } from './unit-type-enum';

export class PortalUnitModel extends BaseUnitModel implements UnitModel {
  constructor(
    id: string,
    itemId: string,
    position: PositionVo,
    direction: DirectionVo,
    private targetPosition: PositionVo | null
  ) {
    super(id, itemId, position, direction);
  }

  static new = (
    itemId: string,
    position: PositionVo,
    direction: DirectionVo,
    targetPosition: PositionVo | null
  ): PortalUnitModel => new PortalUnitModel(generateUuidV4(), itemId, position, direction, targetPosition);

  static mockup(): PortalUnitModel {
    return new PortalUnitModel(generateUuidV4(), generateUuidV4(), PositionVo.new(0, 0), DirectionVo.newDown(), null);
  }

  public clone(): PortalUnitModel {
    return new PortalUnitModel(
      this.getId(),
      this.getItemId(),
      this.getPosition(),
      this.getDirection(),
      this.targetPosition
    );
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
