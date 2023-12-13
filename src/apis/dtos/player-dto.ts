import { PositionVo } from '@/models/world/common/position-vo';
import { PlayerModel } from '@/models/world/player/player-model';
import type { PositionDto } from './position-dto';
import { PlayerActionDto, parsePlayerActionDto } from './player-action-dto';

type PlayerDto = {
  id: string;
  name: string;
  position: PositionDto;
  heldItemId: string | null;
  action: PlayerActionDto;
};

function parsePlayerDto(playerDto: PlayerDto): PlayerModel {
  return PlayerModel.new(
    playerDto.id,
    playerDto.name,
    playerDto.heldItemId,
    parsePlayerActionDto(playerDto.action),
    PositionVo.new(playerDto.action.position.x, playerDto.action.position.z)
  );
}

export type { PlayerDto };
export { parsePlayerDto };
