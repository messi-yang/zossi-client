import { DirectionModel } from '@/models/world/common/direction-model';
import { PositionModel } from '@/models/world/common/position-model';
import { UnitModel } from '@/models/world/unit/unit-model';
import { PositionDto } from './position-dto';
import { StaticUnitModel } from '@/models/world/unit/static-unit-model';
import { PortalUnitModel } from '@/models/world/unit/portal-unit-model';
import { UnitTypeEnum } from '@/models/world/unit/unit-type-enum';
import { DirectionEnum } from '@/models/world/common/direction-enum';

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

interface PortalUnitDto extends UnitDtoBase {
  type: UnitTypeEnum.Portal;
  itemId: string;
  position: PositionDto;
  direction: DirectionEnum;
  info: {
    targetPosition: PositionDto | null;
  };
}

type UnitDto = StaticUnitDto | PortalUnitDto;

function parseUnitDto(unitDto: UnitDto): UnitModel {
  const position = PositionModel.new(unitDto.position.x, unitDto.position.z);
  const direction = DirectionModel.new(unitDto.direction);
  if (unitDto.type === UnitTypeEnum.Portal) {
    const tartgetPosition = unitDto.info.targetPosition
      ? PositionModel.new(unitDto.info.targetPosition.x, unitDto.info.targetPosition.z)
      : null;
    return PortalUnitModel.new(unitDto.itemId, position, direction, tartgetPosition);
  } else {
    return StaticUnitModel.new(unitDto.itemId, position, direction);
  }
}

export type { UnitDto };
export { parseUnitDto };
