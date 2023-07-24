import { WorldModel } from '@/models';
import { BoundDto, parseBoundDto } from './bound-dto';
import { UserDto, parseUserDto } from './user-dto';

type WorldDto = {
  id: string;
  name: string;
  user: UserDto;
  bound: BoundDto;
};

function parseWorldDto(dto: WorldDto): WorldModel {
  return WorldModel.new(dto.id, dto.name, parseUserDto(dto.user), parseBoundDto(dto.bound));
}

export type { WorldDto };
export { parseWorldDto };
