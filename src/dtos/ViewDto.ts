import { ViewVo, MapVo } from '@/models/valueObjects';
import { mapMatrix } from '@/libs/common';
import { convertBoundDtoToBound } from './boundDto';
import type { BoundDto } from './boundDto';
import { convertUnitDtoToUnit } from './unitDto';
import type { UnitDto } from './unitDto';

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
