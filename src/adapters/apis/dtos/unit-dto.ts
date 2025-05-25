import { DirectionVo } from '@/models/world/common/direction-vo';
import { PositionVo } from '@/models/world/common/position-vo';
import { UnitModel } from '@/models/world/unit/unit-model';
import { PositionDto } from './position-dto';
import { UnitTypeEnum } from '@/models/world/unit/unit-type-enum';
import { DirectionEnum } from '@/models/world/common/direction-enum';
import { DimensionDto } from './dimension-dto';
import { DimensionVo } from '@/models/world/common/dimension-vo';
import { ColorVo } from '@/models/world/common/color-vo';

type UnitDtoBase = {
  id: string;
  type: UnitTypeEnum;
  itemId: string;
  position: PositionDto;
  direction: DirectionEnum;
  dimension: DimensionDto;
  label: string | null;
  color: string | null;
  info: Object | null;
};

interface StaticUnitDto extends UnitDtoBase {
  type: UnitTypeEnum.Static;
  info: null;
}

interface FenceUnitDto extends UnitDtoBase {
  type: UnitTypeEnum.Fence;
  info: null;
}

interface PortalUnitDto extends UnitDtoBase {
  type: UnitTypeEnum.Portal;
  info: null;
}

interface LinkUnitDto extends UnitDtoBase {
  type: UnitTypeEnum.Link;
}

interface EmbedUnitDto extends UnitDtoBase {
  type: UnitTypeEnum.Embed;
}

interface ColorUnitDto extends UnitDtoBase {
  type: UnitTypeEnum.Color;
  color: string;
}

interface SignUnitDto extends UnitDtoBase {
  type: UnitTypeEnum.Sign;
  label: string;
}

type UnitDto = StaticUnitDto | PortalUnitDto | FenceUnitDto | LinkUnitDto | EmbedUnitDto | ColorUnitDto | SignUnitDto;

function parseUnitDto(unitDto: UnitDto): UnitModel {
  const position = PositionVo.create(unitDto.position.x, unitDto.position.z);
  const direction = DirectionVo.create(unitDto.direction);
  const dimension = DimensionVo.create(unitDto.dimension.width, unitDto.dimension.depth);
  const color = unitDto.color ? ColorVo.parse(unitDto.color) : null;

  return UnitModel.create(unitDto.id, unitDto.type, unitDto.itemId, position, direction, dimension, unitDto.label, color);
}

export type { UnitDto };
export { parseUnitDto };
