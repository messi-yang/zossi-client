import { WorldModel } from '@/models/world/world/world-model';
import { DateVo } from '@/models/global/date-vo';

type WorldDto = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

function parseWorldDto(dto: WorldDto): WorldModel {
  return WorldModel.create(dto.id, dto.name, DateVo.parseString(dto.createdAt), DateVo.parseString(dto.updatedAt));
}

export type { WorldDto };
export { parseWorldDto };
