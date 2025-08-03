import { ColorVo } from '../common/color-vo';
import { DimensionVo } from '../common/dimension-vo';
import { DirectionVo } from '../common/direction-vo';
import { PositionVo } from '../common/position-vo';
import { UnitTypeEnum } from './unit-type-enum';
import { BaseUnitModel } from './base-unit-model';

export class UnitModel extends BaseUnitModel {
  static create = (
    id: string,
    type: UnitTypeEnum,
    itemId: string,
    position: PositionVo,
    direction: DirectionVo,
    dimension: DimensionVo,
    label: string | null,
    color: ColorVo | null
  ): UnitModel => new UnitModel(id, type, itemId, position, direction, dimension, label, color);

  public clone(): UnitModel {
    return new UnitModel(this.id, this.type, this.itemId, this.position, this.direction, this.dimension, this.label, this.color);
  }
}
