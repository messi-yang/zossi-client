import { generateUuidV4 } from '@/utils/uuid';
import { DirectionVo } from '../common/direction-vo';
import { PositionVo } from '../common/position-vo';
import { BaseUnitModel, UnitModel } from './unit-model';
import { UnitTypeEnum } from './unit-type-enum';

export class EmbedUnitModel extends BaseUnitModel implements UnitModel {
  static new = (itemId: string, position: PositionVo, direction: DirectionVo, label: string | null): EmbedUnitModel =>
    new EmbedUnitModel(generateUuidV4(), itemId, position, direction, label);

  static load = (
    id: string,
    itemId: string,
    position: PositionVo,
    direction: DirectionVo,
    label: string | null
  ): EmbedUnitModel => new EmbedUnitModel(id, itemId, position, direction, label);

  static mockup(): EmbedUnitModel {
    return new EmbedUnitModel(generateUuidV4(), generateUuidV4(), PositionVo.new(0, 0), DirectionVo.newDown(), null);
  }

  public clone(): EmbedUnitModel {
    return new EmbedUnitModel(this.getId(), this.getItemId(), this.getPosition(), this.getDirection(), this.getLabel());
  }

  public getType(): UnitTypeEnum.Embed {
    return UnitTypeEnum.Embed;
  }
}
