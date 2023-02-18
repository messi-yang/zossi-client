import { UnitAgg } from '@/models/aggregates';
import { LocationVo } from '@/models/valueObjects';
import { LocationDto } from './LocationDto';

type UnitDto = {
  itemId: number;
  location: LocationDto;
};

function convertUnitDtoToUnit(unitDto: UnitDto): UnitAgg {
  const location = LocationVo.new(unitDto.location.x, unitDto.location.z);
  return UnitAgg.new(unitDto.itemId, location);
}

export type { UnitDto };
export { convertUnitDtoToUnit };
