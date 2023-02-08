import { ViewVo } from '@/models/valueObjects';
import { convertBoundDtoToBound } from './BoundDto';
import type { BoundDto } from './BoundDto';
import { convertUnitDtoToUnit } from './UnitDto';
import type { UnitDto } from './UnitDto';

type ViewDto = {
  bound: BoundDto;
  units: UnitDto[];
};

function convertViewDtoToView(viewDto: ViewDto): ViewVo {
  const bound = convertBoundDtoToBound(viewDto.bound);
  const units = viewDto.units.map(convertUnitDtoToUnit);
  return ViewVo.new(bound, units);
}

export type { ViewDto };
export { convertViewDtoToView };
