import { DimensionVo } from '../common/dimension-vo';
import { DirectionVo } from '../common/direction-vo';
import { PositionVo } from '../common/position-vo';
import { UnitModel } from './unit-model';
import { UnitTypeEnum } from './unit-type-enum';
import { generateUuidV4 } from '@/utils/uuid';

export class FenceUnitModel extends UnitModel {
  constructor(id: string, itemId: string, position: PositionVo, direction: DirectionVo, dimension: DimensionVo) {
    super(id, UnitTypeEnum.Fence, itemId, position, direction, dimension, null, null);
  }

  static create = (id: string, itemId: string, position: PositionVo, direction: DirectionVo, dimension: DimensionVo): FenceUnitModel =>
    new FenceUnitModel(id, itemId, position, direction, dimension);

  static createMock(): FenceUnitModel {
    return new FenceUnitModel(generateUuidV4(), generateUuidV4(), PositionVo.create(0, 0), DirectionVo.newDown(), DimensionVo.create(1, 1));
  }

  public clone() {
    return new FenceUnitModel(this.getId(), this.getItemId(), this.getPosition(), this.getDirection(), this.getDimension());
  }
}
