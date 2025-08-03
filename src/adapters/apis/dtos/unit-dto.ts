import { DirectionVo } from '@/models/world/common/direction-vo';
import { PositionVo } from '@/models/world/common/position-vo';
import { UnitModel } from '@/models/world/unit/unit-model';
import { PositionDto } from './position-dto';
import { UnitTypeEnum } from '@/models/world/unit/unit-type-enum';
import { DirectionEnum } from '@/models/world/common/direction-enum';
import { DimensionDto } from './dimension-dto';
import { DimensionVo } from '@/models/world/common/dimension-vo';
import { ColorVo } from '@/models/world/common/color-vo';
import { PortalUnitModel } from '@/models/world/unit/portal-unit-model';

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

interface PortalUnitDto extends UnitDtoBase {
  type: UnitTypeEnum.Portal;
  label: string;
  targetUnitId: string;
}

interface UnitDto extends UnitDtoBase {}

function parseUnitDto(unitDto: UnitDto): UnitModel {
  const position = PositionVo.create(unitDto.position.x, unitDto.position.z);
  const direction = DirectionVo.create(unitDto.direction);
  const dimension = DimensionVo.create(unitDto.dimension.width, unitDto.dimension.depth);
  const color = unitDto.color ? ColorVo.parse(unitDto.color) : null;

  return UnitModel.create(unitDto.id, unitDto.type, unitDto.itemId, position, direction, dimension, unitDto.label, color);
}

function parsePortalUnitDto(portalUnitDto: PortalUnitDto): PortalUnitModel {
  const position = PositionVo.create(portalUnitDto.position.x, portalUnitDto.position.z);
  const direction = DirectionVo.create(portalUnitDto.direction);
  const dimension = DimensionVo.create(portalUnitDto.dimension.width, portalUnitDto.dimension.depth);
  return PortalUnitModel.create(
    portalUnitDto.id,
    portalUnitDto.type,
    portalUnitDto.itemId,
    position,
    direction,
    dimension,
    portalUnitDto.label,
    portalUnitDto.targetUnitId
  );
}

export type { UnitDto, PortalUnitDto };
export { parseUnitDto, parsePortalUnitDto };
