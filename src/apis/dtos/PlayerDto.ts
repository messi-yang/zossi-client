import { PlayerAgg } from '@/models/aggregates';
import { DirectionVo, PositionVo } from '@/models/valueObjects';
import { BoundDto, convertBoundDtoToBound } from './BoundDto';
import type { PositionDto } from './PositionDto';

type PlayerDto = {
  id: string;
  name: string;
  position: PositionDto;
  direction: 0 | 1 | 2 | 3;
  visionBound: BoundDto;
  heldItemId: string | null;
};

function convertPlayerDtoPlayer(playerDto: PlayerDto): PlayerAgg {
  return PlayerAgg.new({
    id: playerDto.id,
    name: playerDto.name,
    position: PositionVo.new(playerDto.position.x, playerDto.position.z),
    direction: DirectionVo.new(playerDto.direction),
    visionBound: convertBoundDtoToBound(playerDto.visionBound),
    heldItemId: playerDto.heldItemId,
  });
}

export type { PlayerDto };
export { convertPlayerDtoPlayer };