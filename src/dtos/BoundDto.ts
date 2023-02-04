import { BoundVo, LocationVo } from '@/models/valueObjects';
import type { LocationDto } from './LocationDto';

type BoundDto = {
  from: LocationDto;
  to: LocationDto;
};

export function convertBoundDtoToBound(boundDto: BoundDto): BoundVo {
  return BoundVo.new(LocationVo.new(boundDto.from.x, boundDto.from.y), LocationVo.new(boundDto.to.x, boundDto.to.y));
}

export type { BoundDto };
