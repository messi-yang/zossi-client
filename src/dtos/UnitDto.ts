import { LocationVo, UnitVo } from '@/models/valueObjects';
import { LocationDto } from './LocationDto';

type UnitDto = {
  itemId: number;
  location: LocationDto;
};

function convertUnitDtoToUnit(unitDto: UnitDto): UnitVo {
  const location = LocationVo.new(unitDto.location.x, unitDto.location.z);
  return UnitVo.new(unitDto.itemId, location);
}

export type { UnitDto };
export { convertUnitDtoToUnit };
