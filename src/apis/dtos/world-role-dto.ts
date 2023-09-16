import { WorldRoleModel } from '@/models/global/world-role-model';

type WorldRoleDto = 'owner' | 'admin' | 'editor' | 'viewer';

function parseWorldRoleDto(dto: WorldRoleDto): WorldRoleModel {
  return WorldRoleModel.new(dto);
}

export type { WorldRoleDto };
export { parseWorldRoleDto };
