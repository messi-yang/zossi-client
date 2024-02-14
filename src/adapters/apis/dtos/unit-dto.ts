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

type UnitDtoBase = {
  id: string;
  type: UnitTypeEnum;
  itemId: string;
  position: PositionDto;
  direction: DirectionEnum;
  label: string | null;
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
  info: {
    targetPosition: PositionDto | null;
  };
}

interface LinkUnitDto extends UnitDtoBase {
  type: UnitTypeEnum.Link;
}

type UnitDto = StaticUnitDto | PortalUnitDto | FenceUnitDto | LinkUnitDto;

function parseUnitDto(unitDto: UnitDto): UnitModel {
  const position = PositionVo.new(unitDto.position.x, unitDto.position.z);
  const direction = DirectionVo.new(unitDto.direction);

  if (unitDto.type === UnitTypeEnum.Static) {
    return StaticUnitModel.load(unitDto.id, unitDto.itemId, position, direction);
  } else if (unitDto.type === UnitTypeEnum.Fence) {
    return FenceUnitModel.load(unitDto.id, unitDto.itemId, position, direction);
  } else if (unitDto.type === UnitTypeEnum.Portal) {
    const tartgetPosition = unitDto.info.targetPosition
      ? PositionVo.new(unitDto.info.targetPosition.x, unitDto.info.targetPosition.z)
      : null;
    return PortalUnitModel.load(unitDto.id, unitDto.itemId, position, direction, tartgetPosition);
  } else {
    return LinkUnitModel.load(unitDto.id, unitDto.itemId, position, direction, unitDto.label);
  }
}

export type { UnitDto };
export { parseUnitDto };
