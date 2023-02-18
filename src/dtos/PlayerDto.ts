import { PlayerAgg } from '@/models/aggregates';
import { DirectionVo, LocationVo } from '@/models/valueObjects';
import type { LocationDto } from './LocationDto';

type PlayerDto = {
  id: string;
  name: string;
  location: LocationDto;
  direction: 0 | 1 | 2 | 3;
};

function convertPlayerDtoPlayer(playerDto: PlayerDto): PlayerAgg {
  return PlayerAgg.new({
    id: playerDto.id,
    name: playerDto.name,
    location: LocationVo.new(playerDto.location.x, playerDto.location.z),
    direction: DirectionVo.new(playerDto.direction),
  });
}

export type { PlayerDto };
export { convertPlayerDtoPlayer };
