import { PlayerActionNameEnum } from '@/models/world/player/player-action-name-enum';
import { PlayerActionVo } from '@/models/world/player/player-action-vo';
import { DirectionEnum } from '@/models/world/common/direction-enum';
import { DirectionVo } from '@/models/world/common/direction-vo';

export type PlayerActionDto = {
  name: PlayerActionNameEnum;
  direction: DirectionEnum;
};

export function newPlayerActionDto(playerAction: PlayerActionVo): PlayerActionDto {
  return {
    name: playerAction.getName(),
    direction: playerAction.getDirection().toNumber(),
  };
}

export function parsePlayerActionDto(dto: PlayerActionDto): PlayerActionVo {
  return PlayerActionVo.create(dto.name, DirectionVo.create(dto.direction));
}
