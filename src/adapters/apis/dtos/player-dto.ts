import { PlayerModel } from '@/models/world/player/player-model';
import { PlayerActionDto, parsePlayerActionDto } from './player-action-dto';
import { PrecisePositionDto } from './precise-position-dto';
import { PrecisePositionVo } from '@/models/world/common/precise-position-vo';

type PlayerDto = {
  id: string;
  name: string;
  precisePosition: PrecisePositionDto;
  heldItemId: string | null;
  action: PlayerActionDto;
};

function parsePlayerDto(playerDto: PlayerDto): PlayerModel {
  return PlayerModel.create(
    playerDto.id,
    playerDto.name,
    playerDto.heldItemId,
    parsePlayerActionDto(playerDto.action),
    PrecisePositionVo.create(playerDto.precisePosition.x, playerDto.precisePosition.z)
  );
}

export type { PlayerDto };
export { parsePlayerDto };
