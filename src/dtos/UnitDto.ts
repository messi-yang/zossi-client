import { UnitAgg } from '@/models/aggregates';
import { DirectionVo, PositionVo } from '@/models/valueObjects';
import { PositionDto } from './PositionDto';

type UnitDto = {
  itemId: string;
  position: PositionDto;
  direction: 0 | 1 | 2 | 3;
};

function convertUnitDtoToUnit(unitDto: UnitDto): UnitAgg {
  const position = PositionVo.new(unitDto.position.x, unitDto.position.z);
  const direction = DirectionVo.new(unitDto.direction);
  return UnitAgg.new(unitDto.itemId, position, direction);
}

export type { UnitDto };
export { convertUnitDtoToUnit };
