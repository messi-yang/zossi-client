import { generateUuidV4 } from '@/utils/uuid';
import { DirectionVo } from '../common/direction-vo';
import { PositionVo } from '../common/position-vo';
import { BaseUnitModel, UnitModel } from './unit-model';
import { UnitTypeEnum } from './unit-type-enum';

export class LinkUnitModel extends BaseUnitModel implements UnitModel {
  static new = (itemId: string, position: PositionVo, direction: DirectionVo): LinkUnitModel =>
    new LinkUnitModel(generateUuidV4(), itemId, position, direction);

  static mockup(): LinkUnitModel {
    return new LinkUnitModel(generateUuidV4(), generateUuidV4(), PositionVo.new(0, 0), DirectionVo.newDown());
  }

  public clone(): LinkUnitModel {
    return new LinkUnitModel(this.getId(), this.getItemId(), this.getPosition(), this.getDirection());
  }

  public getType(): UnitTypeEnum.Link {
    return UnitTypeEnum.Link;
  }
}
