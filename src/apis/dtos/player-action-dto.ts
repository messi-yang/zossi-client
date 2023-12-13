import { PlayerActionNameEnum } from '@/models/world/player/player-action-name-enum';
import { PositionDto, newPositionDto } from './position-dto';
import { PlayerActionVo } from '@/models/world/player/player-action-vo';
import { DateVo } from '@/models/general/date-vo';
import { PositionVo } from '@/models/world/common/position-vo';
import { DirectionEnum } from '@/models/world/common/direction-enum';
import { DirectionVo } from '@/models/world/common/direction-vo';

export type PlayerActionDto = {
  name: PlayerActionNameEnum;
  position: PositionDto;
  direction: DirectionEnum;
  time: number;
};

export function newPlayerActionDto(playerAction: PlayerActionVo): PlayerActionDto {
  return {
    name: playerAction.getName(),
    position: newPositionDto(playerAction.getPosition()),
    direction: playerAction.getDirection().toNumber(),
    time: playerAction.getTime().getTimestamp(),
  };
}

export function parsePlayerActionDto(dto: PlayerActionDto): PlayerActionVo {
  return PlayerActionVo.new(
    dto.name,
    PositionVo.new(dto.position.x, dto.position.z),
    DirectionVo.new(dto.direction),
    DateVo.fromTimestamp(dto.time)
  );
}
