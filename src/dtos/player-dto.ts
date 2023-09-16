import { DirectionModel } from '@/models/world/direction-model';
import { PositionModel } from '@/models/world/position-model';
import { PlayerModel } from '@/models/world/player-model';
import type { PositionDto } from './position-dto';

type PlayerDto = {
  id: string;
  name: string;
  position: PositionDto;
  direction: 0 | 1 | 2 | 3;
  heldItemId: string | null;
};

function parsePlayerDto(playerDto: PlayerDto): PlayerModel {
  return PlayerModel.new(
    playerDto.id,
    playerDto.name,
    PositionModel.new(playerDto.position.x, playerDto.position.z),
    DirectionModel.new(playerDto.direction),
    playerDto.heldItemId
  );
}

export type { PlayerDto };
export { parsePlayerDto };
