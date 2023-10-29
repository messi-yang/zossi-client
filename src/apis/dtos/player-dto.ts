import { DirectionModel } from '@/models/world/common/direction-model';
import { PositionModel } from '@/models/world/common/position-model';
import { PlayerModel } from '@/models/world/player/player-model';
import type { PositionDto } from './position-dto';
import { DirectionEnum } from '@/models/world/common/direction-enum';
import { PlayerActionVo } from '@/models/world/player/player-action-vo';
import { PlayerActionEnum } from '@/models/world/player/player-action-enum';
import { DateModel } from '@/models/general/date-model';

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
    DirectionModel.new(playerDto.direction),
    playerDto.heldItemId,
    PlayerActionVo.new(playerDto.action),
    PositionModel.new(playerDto.actionPosition.x, playerDto.actionPosition.z),
    DateModel.parseString(playerDto.actedAt)
  );
}

export type { PlayerDto };
export { parsePlayerDto };
