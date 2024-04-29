import { WorldModel } from '@/models/world/world/world-model';
import { BoundDto, parseBoundDto } from './bound-dto';
import { DateVo } from '@/models/global/date-vo';

type WorldDto = {
  id: string;
  name: string;
  bound: BoundDto;
  createdAt: string;
  updatedAt: string;
};

function parseWorldDto(dto: WorldDto): WorldModel {
  return WorldModel.create(
    dto.id,
    dto.name,
    parseBoundDto(dto.bound),
    DateVo.parseString(dto.createdAt),
    DateVo.parseString(dto.updatedAt)
  );
}

export type { WorldDto };
export { parseWorldDto };
