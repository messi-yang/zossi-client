import { BoundVo } from '@/models/world/common/bound-vo';
import type { PositionDto } from './position-dto';
import { PositionVo } from '@/models/world/common/position-vo';

type BoundDto = {
  from: PositionDto;
  to: PositionDto;
};

export function parseBoundDto(boundDto: BoundDto): BoundVo {
  return BoundVo.new(PositionVo.new(boundDto.from.x, boundDto.from.z), PositionVo.new(boundDto.to.x, boundDto.to.z));
}

export type { BoundDto };
