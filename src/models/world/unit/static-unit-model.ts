import { generateUuidV4 } from '@/utils/uuid';
import { DirectionVo } from '../common/direction-vo';
import { PositionVo } from '../common/position-vo';
import { UnitModel } from './unit-model';
import { UnitTypeEnum } from './unit-type-enum';
import { DimensionVo } from '../common/dimension-vo';

export class StaticUnitModel extends UnitModel {
  constructor(id: string, itemId: string, position: PositionVo, direction: DirectionVo, dimension: DimensionVo) {
    super(id, UnitTypeEnum.Static, itemId, position, direction, dimension, null);
  }

  static create = (id: string, itemId: string, position: PositionVo, direction: DirectionVo, dimension: DimensionVo): StaticUnitModel =>
    new StaticUnitModel(id, itemId, position, direction, dimension);

  static createMock(): StaticUnitModel {
    return new StaticUnitModel(
      generateUuidV4(),
      generateUuidV4(),
      PositionVo.create(0, 0),
      DirectionVo.newDown(),
      DimensionVo.create(1, 1)
    );
  }

  public clone() {
    return new StaticUnitModel(this.getId(), this.getItemId(), this.getPosition(), this.getDirection(), this.getDimension());
  }

  public getType() {
    return UnitTypeEnum.Static;
  }
}
