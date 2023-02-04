import { UnitVo } from '@/models/valueObjects';

type UnitDto = {
  itemId: string | null;
};

function convertUnitDtoToUnit(unitDto: UnitDto): UnitVo {
  return UnitVo.new(unitDto.itemId);
}

export type { UnitDto };
export { convertUnitDtoToUnit };
