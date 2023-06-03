import { WorldModel } from '@/models';

type WorldDto = {
  id: string;
  name: string;
  userId: string;
};

function convertWorldDtoToWorld(dto: WorldDto): WorldModel {
  return WorldModel.new(dto.id, dto.name, dto.userId);
}

export type { WorldDto };
export { convertWorldDtoToWorld };
