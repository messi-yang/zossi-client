import { generateUuidV4 } from '@/utils/uuid';
import { DirectionVo } from '../common/direction-vo';
import { PositionVo } from '../common/position-vo';
import { BaseUnitModel, UnitModel } from './unit-model';
import { UnitTypeEnum } from './unit-type-enum';
import { DimensionVo } from '../common/dimension-vo';

export class LinkUnitModel extends BaseUnitModel implements UnitModel {
  constructor(
    id: string,
    itemId: string,
    position: PositionVo,
    direction: DirectionVo,
    dimension: DimensionVo,
    label: string | null
  ) {
    super(id, UnitTypeEnum.Link, itemId, position, direction, dimension, label);
  }

  static create = (
    id: string,
    itemId: string,
    position: PositionVo,
    direction: DirectionVo,
    dimension: DimensionVo,
    label: string | null
  ): LinkUnitModel => new LinkUnitModel(id, itemId, position, direction, dimension, label);

  static createMock(): LinkUnitModel {
    return new LinkUnitModel(
      generateUuidV4(),
      generateUuidV4(),
      PositionVo.create(0, 0),
      DirectionVo.newDown(),
      DimensionVo.create(1, 1),
      null
    );
  }

  public clone(): LinkUnitModel {
    return new LinkUnitModel(
      this.getId(),
      this.getItemId(),
      this.getPosition(),
      this.getDirection(),
      this.getDimension(),
      this.getLabel()
    );
  }
}
