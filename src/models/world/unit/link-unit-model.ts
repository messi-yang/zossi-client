import { generateUuidV4 } from '@/utils/uuid';
import { DirectionVo } from '../common/direction-vo';
import { PositionVo } from '../common/position-vo';
import { BaseUnitModel, UnitModel } from './unit-model';
import { UnitTypeEnum } from './unit-type-enum';

export class LinkUnitModel extends BaseUnitModel implements UnitModel {
  static new = (itemId: string, position: PositionVo, direction: DirectionVo, label: string | null): LinkUnitModel =>
    new LinkUnitModel(generateUuidV4(), itemId, position, direction, label);

  static load = (
    id: string,
    itemId: string,
    position: PositionVo,
    direction: DirectionVo,
    label: string | null
  ): LinkUnitModel => new LinkUnitModel(id, itemId, position, direction, label);

  static mockup(): LinkUnitModel {
    return new LinkUnitModel(generateUuidV4(), generateUuidV4(), PositionVo.new(0, 0), DirectionVo.newDown(), null);
  }

  public clone(): LinkUnitModel {
    return new LinkUnitModel(this.getId(), this.getItemId(), this.getPosition(), this.getDirection(), this.getLabel());
  }

  public getType(): UnitTypeEnum.Link {
    return UnitTypeEnum.Link;
  }
}
