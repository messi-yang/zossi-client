import { generateUuidV4 } from '@/utils/uuid';
import { DirectionVo } from '../common/direction-vo';
import { PositionVo } from '../common/position-vo';
import { UnitModel } from './unit-model';
import { UnitTypeEnum } from './unit-type-enum';
import { DimensionVo } from '../common/dimension-vo';

export class SignUnitModel extends UnitModel {
  constructor(id: string, itemId: string, position: PositionVo, direction: DirectionVo, dimension: DimensionVo, protected label: string) {
    super(id, UnitTypeEnum.Sign, itemId, position, direction, dimension, label, null);
  }

  static create = (
    id: string,
    itemId: string,
    position: PositionVo,
    direction: DirectionVo,
    dimension: DimensionVo,
    label: string
  ): SignUnitModel => new SignUnitModel(id, itemId, position, direction, dimension, label);

  static createMock(): SignUnitModel {
    return new SignUnitModel(
      generateUuidV4(),
      generateUuidV4(),
      PositionVo.create(0, 0),
      DirectionVo.newDown(),
      DimensionVo.create(1, 1),
      'Mock Sign'
    );
  }

  public clone(): SignUnitModel {
    return new SignUnitModel(this.getId(), this.getItemId(), this.getPosition(), this.getDirection(), this.getDimension(), this.label);
  }

  public getType() {
    return UnitTypeEnum.Sign;
  }
}
