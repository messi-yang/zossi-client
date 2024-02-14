import { generateUuidV4 } from '@/utils/uuid';
import { DirectionVo } from '../common/direction-vo';
import { PositionVo } from '../common/position-vo';
import { BaseUnitModel, UnitModel } from './unit-model';
import { UnitTypeEnum } from './unit-type-enum';

export class StaticUnitModel extends BaseUnitModel implements UnitModel {
  constructor(id: string, itemId: string, position: PositionVo, direction: DirectionVo) {
    super(id, itemId, position, direction, null);
  }

  static new = (itemId: string, position: PositionVo, direction: DirectionVo): StaticUnitModel =>
    new StaticUnitModel(generateUuidV4(), itemId, position, direction);

  static load = (id: string, itemId: string, position: PositionVo, direction: DirectionVo): StaticUnitModel =>
    new StaticUnitModel(id, itemId, position, direction);

  static mockup(): StaticUnitModel {
    return new StaticUnitModel(generateUuidV4(), generateUuidV4(), PositionVo.new(0, 0), DirectionVo.newDown());
  }

  public clone() {
    return new StaticUnitModel(this.getId(), this.getItemId(), this.getPosition(), this.getDirection());
  }

  public getType() {
    return UnitTypeEnum.Static;
  }
}
