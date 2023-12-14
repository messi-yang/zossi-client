import { PlayerActionNameEnum } from '@/models/world/player/player-action-name-enum';
import { PlayerActionVo } from '@/models/world/player/player-action-vo';
import { DateVo } from '@/models/general/date-vo';
import { DirectionEnum } from '@/models/world/common/direction-enum';
import { DirectionVo } from '@/models/world/common/direction-vo';
import { PrecisePositionDto, newPrecisePositionDto } from './precise-position-dto';
import { PrecisePositionVo } from '@/models/world/common/precise-position-vo';

export type PlayerActionDto = {
  name: PlayerActionNameEnum;
  precisePosition: PrecisePositionDto;
  direction: DirectionEnum;
  time: number;
};

export function newPlayerActionDto(playerAction: PlayerActionVo): PlayerActionDto {
  return {
    name: playerAction.getName(),
    precisePosition: newPrecisePositionDto(playerAction.getPrecisePosition()),
    direction: playerAction.getDirection().toNumber(),
    time: playerAction.getTime().getTimestamp(),
  };
}

export function parsePlayerActionDto(dto: PlayerActionDto): PlayerActionVo {
  return PlayerActionVo.new(
    dto.name,
    PrecisePositionVo.new(dto.precisePosition.x, dto.precisePosition.z),
    DirectionVo.new(dto.direction),
    DateVo.fromTimestamp(dto.time)
  );
}
