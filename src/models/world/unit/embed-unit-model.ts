import { generateUuidV4 } from '@/utils/uuid';
import { DirectionVo } from '../common/direction-vo';
import { PositionVo } from '../common/position-vo';
import { BaseUnitModel, UnitModel } from './unit-model';
import { UnitTypeEnum } from './unit-type-enum';
import { DimensionVo } from '../common/dimension-vo';

export class EmbedUnitModel extends BaseUnitModel implements UnitModel {
  constructor(
    id: string,
    itemId: string,
    position: PositionVo,
    direction: DirectionVo,
    dimension: DimensionVo,
    label: string | null
  ) {
    super(id, UnitTypeEnum.Embed, itemId, position, direction, dimension, label);
  }

  static new = (
    id: string,
    itemId: string,
    position: PositionVo,
    direction: DirectionVo,
    dimension: DimensionVo,
    label: string | null
  ): EmbedUnitModel => new EmbedUnitModel(id, itemId, position, direction, dimension, label);

  static mockup(): EmbedUnitModel {
    return new EmbedUnitModel(
      generateUuidV4(),
      generateUuidV4(),
      PositionVo.new(0, 0),
      DirectionVo.newDown(),
      DimensionVo.new(1, 1),
      null
    );
  }

  public clone(): EmbedUnitModel {
    return new EmbedUnitModel(
      this.getId(),
      this.getItemId(),
      this.getPosition(),
      this.getDirection(),
      this.getDimension(),
      this.getLabel()
    );
  }
}
