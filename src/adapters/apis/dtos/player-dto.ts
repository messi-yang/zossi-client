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
  return PlayerModel.new(
    playerDto.id,
    playerDto.name,
    playerDto.heldItemId,
    parsePlayerActionDto(playerDto.action),
    PrecisePositionVo.new(playerDto.action.precisePosition.x, playerDto.action.precisePosition.z)
  );
}

export type { PlayerDto };
export { parsePlayerDto };
