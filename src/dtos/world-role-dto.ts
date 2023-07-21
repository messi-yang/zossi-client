import { WorldRoleModel } from '@/models/world-role-model';

type WorldRoleDto = 'owner' | 'admin' | 'editor' | 'viewer';

function convertWorldRoleDtoToWorldRole(dto: WorldRoleDto): WorldRoleModel {
  return WorldRoleModel.new(dto);
}

export type { WorldRoleDto };
export { convertWorldRoleDtoToWorldRole };
