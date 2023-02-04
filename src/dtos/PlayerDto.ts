import { PlayerEntity } from '@/models/entities';
import { LocationVo } from '@/models/valueObjects';
import type { LocationDto } from './LocationDto';

type PlayerDto = {
  id: string;
  name: string;
  location: LocationDto;
};

function convertPlayerDtoPlayer(playerDto: PlayerDto): PlayerEntity {
  return PlayerEntity.new({
    id: playerDto.id,
    name: playerDto.name,
    location: LocationVo.new(playerDto.location.x, playerDto.location.y),
  });
}

export type { PlayerDto };
export { convertPlayerDtoPlayer };
