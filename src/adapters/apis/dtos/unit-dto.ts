import { DirectionVo } from '@/models/world/common/direction-vo';
import { PositionVo } from '@/models/world/common/position-vo';
import { UnitModel } from '@/models/world/unit/unit-model';
import { PositionDto } from './position-dto';
import { StaticUnitModel } from '@/models/world/unit/static-unit-model';
import { PortalUnitModel } from '@/models/world/unit/portal-unit-model';
import { UnitTypeEnum } from '@/models/world/unit/unit-type-enum';
import { DirectionEnum } from '@/models/world/common/direction-enum';
import { FenceUnitModel } from '@/models/world/unit/fence-unit-model';
import { LinkUnitModel } from '@/models/world/unit/link-unit-model';
import { EmbedUnitModel } from '@/models/world/unit/embed-unit-model';
import { DimensionDto } from './dimension-dto';
import { DimensionVo } from '@/models/world/common/dimension-vo';
import { ColorUnitModel } from '@/models/world/unit/color-unit-model';
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
}

type UnitDto = StaticUnitDto | PortalUnitDto | FenceUnitDto | LinkUnitDto | EmbedUnitDto | ColorUnitDto;

function parseUnitDto(unitDto: UnitDto): UnitModel {
  const position = PositionVo.create(unitDto.position.x, unitDto.position.z);
  const direction = DirectionVo.create(unitDto.direction);
  const dimension = DimensionVo.create(unitDto.dimension.width, unitDto.dimension.depth);

  if (unitDto.type === UnitTypeEnum.Static) {
    return StaticUnitModel.create(unitDto.id, unitDto.itemId, position, direction, dimension);
  } else if (unitDto.type === UnitTypeEnum.Fence) {
    return FenceUnitModel.create(unitDto.id, unitDto.itemId, position, direction, dimension);
  } else if (unitDto.type === UnitTypeEnum.Portal) {
    return PortalUnitModel.create(unitDto.id, unitDto.itemId, position, direction, dimension);
  } else if (unitDto.type === UnitTypeEnum.Link) {
    return LinkUnitModel.create(unitDto.id, unitDto.itemId, position, direction, dimension, unitDto.label);
  } else if (unitDto.type === UnitTypeEnum.Embed) {
    return EmbedUnitModel.create(unitDto.id, unitDto.itemId, position, direction, dimension, unitDto.label);
  } else if (unitDto.type === UnitTypeEnum.Color) {
    return ColorUnitModel.create(
      unitDto.id,
      unitDto.itemId,
      position,
      direction,
      dimension,
      unitDto.label,
      unitDto.color ? ColorVo.parse(unitDto.color) : null
    );
  }

  // @ts-expect-error
  throw new Error(`invalid unit type: ${unitDto.type}`);
}

export type { UnitDto };
export { parseUnitDto };
