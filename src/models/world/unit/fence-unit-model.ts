import { DirectionVo } from '../common/direction-vo';
import { PositionVo } from '../common/position-vo';
import { BaseUnitModel, UnitModel } from './unit-model';
import { UnitTypeEnum } from './unit-type-enum';
import { generateUuidV4 } from '@/utils/uuid';

export class FenceUnitModel extends BaseUnitModel implements UnitModel {
  constructor(id: string, itemId: string, position: PositionVo, direction: DirectionVo) {
    super(id, itemId, position, direction, null);
  }

  static new = (itemId: string, position: PositionVo, direction: DirectionVo): FenceUnitModel =>
    new FenceUnitModel(generateUuidV4(), itemId, position, direction);

  static load = (id: string, itemId: string, position: PositionVo, direction: DirectionVo): FenceUnitModel =>
    new FenceUnitModel(id, itemId, position, direction);

  static mockup(): FenceUnitModel {
    return new FenceUnitModel(generateUuidV4(), generateUuidV4(), PositionVo.new(0, 0), DirectionVo.newDown());
  }

  public clone() {
    return new FenceUnitModel(this.getId(), this.getItemId(), this.getPosition(), this.getDirection());
  }

  public getType() {
    return UnitTypeEnum.Fence;
  }
}
