import { WorldModel } from '@/models';
import { BoundDto, convertBoundDtoToBound } from './bound-dto';
import { UserDto, convertUserDtoToUser } from './user-dto';

type WorldDto = {
  id: string;
  name: string;
  user: UserDto;
  bound: BoundDto;
};

function convertWorldDtoToWorld(dto: WorldDto): WorldModel {
  return WorldModel.new(dto.id, dto.name, convertUserDtoToUser(dto.user), convertBoundDtoToBound(dto.bound));
}

export type { WorldDto };
export { convertWorldDtoToWorld };
