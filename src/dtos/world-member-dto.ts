import { WorldRoleDto, convertWorldRoleDtoToWorldRole } from './world-role-dto';
import { WorldMemberModel } from '@/models/world-member-model';

type WorldMemberDto = {
  id: string;
  worldId: string;
  userId: string;
  role: WorldRoleDto;
};

function convertWorldMemberDtoToWorldMember(dto: WorldMemberDto): WorldMemberModel {
  return WorldMemberModel.new(dto.id, dto.worldId, dto.userId, convertWorldRoleDtoToWorldRole(dto.role));
}

export type { WorldMemberDto };
export { convertWorldMemberDtoToWorldMember };
