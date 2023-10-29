import { DirectionVo } from '@/models/world/common/direction-vo';
import { PositionVo } from '@/models/world/common/position-vo';
import { PlayerModel } from '@/models/world/player/player-model';
import type { PositionDto } from './position-dto';
import { DirectionEnum } from '@/models/world/common/direction-enum';
import { PlayerActionVo } from '@/models/world/player/player-action-vo';
import { PlayerActionEnum } from '@/models/world/player/player-action-enum';
import { DateVo } from '@/models/general/date-vo';

type PlayerDto = {
  id: string;
  name: string;
  actionPosition: PositionDto;
  direction: DirectionEnum;
  heldItemId: string | null;
  action: PlayerActionEnum;
  actedAt: string;
};

function parsePlayerDto(playerDto: PlayerDto): PlayerModel {
  return PlayerModel.new(
    playerDto.id,
    playerDto.name,
    DirectionVo.new(playerDto.direction),
    playerDto.heldItemId,
    PlayerActionVo.new(playerDto.action),
    PositionVo.new(playerDto.actionPosition.x, playerDto.actionPosition.z),
    DateVo.parseString(playerDto.actedAt)
  );
}

export type { PlayerDto };
export { parsePlayerDto };
