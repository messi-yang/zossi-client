import { ViewVo, MapVo } from '@/models/valueObjects';
import { mapMatrix } from '@/libs/common';
import { convertBoundDtoToBound } from './BoundDto';
import type { BoundDto } from './BoundDto';
import { convertUnitDtoToUnit } from './UnitDto';
import type { UnitDto } from './UnitDto';

type ViewDto = {
  map: UnitDto[][];
  bound: BoundDto;
};

function convertViewDtoToView(viewDto: ViewDto): ViewVo {
  const bound = convertBoundDtoToBound(viewDto.bound);
  const map = MapVo.new(mapMatrix(viewDto.map, (unitDto) => convertUnitDtoToUnit(unitDto)));
  return ViewVo.new(bound, map);
}

export type { ViewDto };
export { convertViewDtoToView };
