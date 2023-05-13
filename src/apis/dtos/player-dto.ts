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
  return PlayerModel.new(
    playerDto.id,
    playerDto.name,
    PositionModel.new(playerDto.position.x, playerDto.position.z),
    DirectionModel.new(playerDto.direction),
    convertBoundDtoToBound(playerDto.visionBound),
    playerDto.heldItemId
  );
}

export type { PlayerDto };
export { convertPlayerDtoPlayer };
