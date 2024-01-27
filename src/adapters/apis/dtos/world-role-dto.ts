import { WorldRoleVo } from '@/models/global/world-role-vo';

type WorldRoleDto = 'owner' | 'admin' | 'editor' | 'viewer';

function parseWorldRoleDto(dto: WorldRoleDto): WorldRoleVo {
  return WorldRoleVo.new(dto);
}

export type { WorldRoleDto };
export { parseWorldRoleDto };
