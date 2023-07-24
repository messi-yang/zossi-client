import { BoundModel, PositionModel } from '@/models';
import type { PositionDto } from './position-dto';

type BoundDto = {
  from: PositionDto;
  to: PositionDto;
};

export function parseBoundDto(boundDto: BoundDto): BoundModel {
  return BoundModel.new(
    PositionModel.new(boundDto.from.x, boundDto.from.z),
    PositionModel.new(boundDto.to.x, boundDto.to.z)
  );
}

export type { BoundDto };
