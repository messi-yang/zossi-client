import { PlayerModel, DirectionModel, PositionModel } from '@/models';
import { BoundDto, convertBoundDtoToBound } from './bound-dto';
import type { PositionDto } from './position-dto';

type PlayerDto = {
  id: string;
  name: string;
  position: PositionDto;
  direction: 0 | 1 | 2 | 3;
  visionBound: BoundDto;
  heldItemId: string | null;
};

function convertPlayerDtoPlayer(playerDto: PlayerDto): PlayerModel {
  return PlayerModel.new({
    id: playerDto.id,
    name: playerDto.name,
    position: PositionModel.new(playerDto.position.x, playerDto.position.z),
    direction: DirectionModel.new(playerDto.direction),
    visionBound: convertBoundDtoToBound(playerDto.visionBound),
    heldItemId: playerDto.heldItemId,
  });
}

export type { PlayerDto };
export { convertPlayerDtoPlayer };
