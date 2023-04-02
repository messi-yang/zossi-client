import { WorldAgg } from '@/models/aggregates';

type WorldDto = {
  id: string;
  name: string;
  userId: string;
};

function convertWorldDtoToUnit(dto: WorldDto): WorldAgg {
  return WorldAgg.new(dto.id, dto.name, dto.userId);
}

export type { WorldDto };
export { convertWorldDtoToUnit };
