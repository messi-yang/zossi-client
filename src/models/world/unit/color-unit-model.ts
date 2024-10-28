import { generateUuidV4 } from '@/utils/uuid';
import { DirectionVo } from '../common/direction-vo';
import { PositionVo } from '../common/position-vo';
import { UnitModel } from './unit-model';
import { UnitTypeEnum } from './unit-type-enum';
import { DimensionVo } from '../common/dimension-vo';
import { ColorVo } from '../common/color-vo';

export class ColorUnitModel extends UnitModel {
  constructor(
    id: string,
    itemId: string,
    position: PositionVo,
    direction: DirectionVo,
    dimension: DimensionVo,
    label: string | null,
    private color: ColorVo
  ) {
    super(id, UnitTypeEnum.Color, itemId, position, direction, dimension, label);
  }

  static create = (
    id: string,
    itemId: string,
    position: PositionVo,
    direction: DirectionVo,
    dimension: DimensionVo,
    label: string | null,
    color: ColorVo
  ): ColorUnitModel => new ColorUnitModel(id, itemId, position, direction, dimension, label, color);

  static createMock(): ColorUnitModel {
    return new ColorUnitModel(
      generateUuidV4(),
      generateUuidV4(),
      PositionVo.create(0, 0),
      DirectionVo.newDown(),
      DimensionVo.create(1, 1),
      null,
      ColorVo.create(255, 255, 255)
    );
  }

  public clone(): ColorUnitModel {
    return new ColorUnitModel(
      this.getId(),
      this.getItemId(),
      this.getPosition(),
      this.getDirection(),
      this.getDimension(),
      this.getLabel(),
      this.color
    );
  }

  public getColor(): ColorVo {
    return this.color;
  }
}
