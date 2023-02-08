import { LocationVo, UnitVo } from '@/models/valueObjects';
import { LocationDto } from './LocationDto';

type UnitDto = {
  itemId: string;
  location: LocationDto;
};

function convertUnitDtoToUnit(unitDto: UnitDto): UnitVo {
  const location = LocationVo.new(unitDto.location.x, unitDto.location.y);
  return UnitVo.new(unitDto.itemId, location);
}

export type { UnitDto };
export { convertUnitDtoToUnit };
