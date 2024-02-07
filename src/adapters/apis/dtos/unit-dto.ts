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
  type: UnitTypeEnum;
  itemId: string;
  position: PositionDto;
  direction: DirectionEnum;
};

interface StaticUnitDto extends UnitDtoBase {
  type: UnitTypeEnum.Static;
  itemId: string;
  position: PositionDto;
  direction: DirectionEnum;
  info: null;
}

interface FenceUnitDto extends UnitDtoBase {
  type: UnitTypeEnum.Fence;
  itemId: string;
  position: PositionDto;
  direction: DirectionEnum;
  info: null;
}

interface PortalUnitDto extends UnitDtoBase {
  type: UnitTypeEnum.Portal;
  itemId: string;
  position: PositionDto;
  direction: DirectionEnum;
  info: {
    targetPosition: PositionDto | null;
  };
}

interface LinkUnitDto extends UnitDtoBase {
  type: UnitTypeEnum.Link;
  itemId: string;
  position: PositionDto;
  direction: DirectionEnum;
}

type UnitDto = StaticUnitDto | PortalUnitDto | FenceUnitDto | LinkUnitDto;

function parseUnitDto(unitDto: UnitDto): UnitModel {
  const position = PositionVo.new(unitDto.position.x, unitDto.position.z);
  const direction = DirectionVo.new(unitDto.direction);

  if (unitDto.type === UnitTypeEnum.Static) {
    return StaticUnitModel.new(unitDto.itemId, position, direction);
  } else if (unitDto.type === UnitTypeEnum.Fence) {
    return FenceUnitModel.new(unitDto.itemId, position, direction);
  } else if (unitDto.type === UnitTypeEnum.Portal) {
    const tartgetPosition = unitDto.info.targetPosition
      ? PositionVo.new(unitDto.info.targetPosition.x, unitDto.info.targetPosition.z)
      : null;
    return PortalUnitModel.new(unitDto.itemId, position, direction, tartgetPosition);
  } else {
    return LinkUnitModel.new(unitDto.itemId, position, direction);
  }
}

export type { UnitDto };
export { parseUnitDto };
