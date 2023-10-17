import { DirectionModel } from '@/models/world/common/direction-model';
import { PositionModel } from '@/models/world/common/position-model';
import { PlayerModel } from '@/models/world/player/player-model';
import type { PositionDto } from './position-dto';
import { DirectionEnum } from '@/models/world/common/direction-enum';

type PlayerDto = {
  id: string;
  name: string;
  position: PositionDto;
  direction: DirectionEnum;
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
