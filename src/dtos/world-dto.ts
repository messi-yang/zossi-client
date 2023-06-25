import { WorldModel } from '@/models';
import { BoundDto, convertBoundDtoToBound } from './bound-dto';

type WorldDto = {
  id: string;
  name: string;
  userId: string;
  bound: BoundDto;
};

function convertWorldDtoToWorld(dto: WorldDto): WorldModel {
  return WorldModel.new(dto.id, dto.name, dto.userId, convertBoundDtoToBound(dto.bound));
}

export type { WorldDto };
export { convertWorldDtoToWorld };
