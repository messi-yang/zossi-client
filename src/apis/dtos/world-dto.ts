import { WorldModel } from '@/models/world/world-model';
import { BoundDto, parseBoundDto } from './bound-dto';
import { UserDto, parseUserDto } from './user-dto';
import { DateModel } from '@/models/general/date-model';

type WorldDto = {
  id: string;
  name: string;
  user: UserDto;
  bound: BoundDto;
  createdAt: string;
  updatedAt: string;
};

function parseWorldDto(dto: WorldDto): WorldModel {
  return WorldModel.new(
    dto.id,
    dto.name,
    parseUserDto(dto.user),
    parseBoundDto(dto.bound),
    DateModel.parseString(dto.createdAt),
    DateModel.parseString(dto.updatedAt)
  );
}

export type { WorldDto };
export { parseWorldDto };
