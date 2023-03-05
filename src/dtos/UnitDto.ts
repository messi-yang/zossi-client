import { UnitAgg } from '@/models/aggregates';
import { PositionVo } from '@/models/valueObjects';
import { PositionDto } from './PositionDto';

type UnitDto = {
  itemId: string;
  position: PositionDto;
};

function convertUnitDtoToUnit(unitDto: UnitDto): UnitAgg {
  const position = PositionVo.new(unitDto.position.x, unitDto.position.z);
  return UnitAgg.new(unitDto.itemId, position);
}

export type { UnitDto };
export { convertUnitDtoToUnit };
