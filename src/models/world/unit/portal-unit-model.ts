import { generateUuidV4 } from '@/utils/uuid';
import { DirectionVo } from '../common/direction-vo';
import { PositionVo } from '../common/position-vo';
import { BaseUnitModel } from './unit-model';
import { UnitTypeEnum } from './unit-type-enum';
import { DimensionVo } from '../common/dimension-vo';

export class PortalUnitModel extends BaseUnitModel {
  constructor(
    id: string,
    itemId: string,
    position: PositionVo,
    direction: DirectionVo,
    dimension: DimensionVo,
    private targetUnitId: string | null
  ) {
    super(id, UnitTypeEnum.Portal, itemId, position, direction, dimension, null);
  }

  static create = (
    id: string,
    itemId: string,
    position: PositionVo,
    direction: DirectionVo,
    dimension: DimensionVo,
    targetUnitId: string | null
  ): PortalUnitModel => new PortalUnitModel(id, itemId, position, direction, dimension, targetUnitId);

  static createMock(): PortalUnitModel {
    return new PortalUnitModel(
      generateUuidV4(),
      generateUuidV4(),
      PositionVo.create(0, 0),
      DirectionVo.newDown(),
      DimensionVo.create(1, 1),
      null
    );
  }

  public clone(): PortalUnitModel {
    return new PortalUnitModel(
      this.getId(),
      this.getItemId(),
      this.getPosition(),
      this.getDirection(),
      this.getDimension(),
      this.targetUnitId
    );
  }

  public getTargetUnitId(): string | null {
    return this.targetUnitId;
  }

  public updateTargetUnitId(targetUnitId: string | null) {
    this.targetUnitId = targetUnitId;
  }
}
