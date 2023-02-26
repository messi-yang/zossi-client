import { BoundVo, PositionVo } from '@/models/valueObjects';
import type { PositionDto } from './PositionDto';

type BoundDto = {
  from: PositionDto;
  to: PositionDto;
};

export function convertBoundDtoToBound(boundDto: BoundDto): BoundVo {
  return BoundVo.new(PositionVo.new(boundDto.from.x, boundDto.from.z), PositionVo.new(boundDto.to.x, boundDto.to.z));
}

export type { BoundDto };
