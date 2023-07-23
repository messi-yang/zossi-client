import { UserDto, convertUserDtoToUser } from './user-dto';
import { WorldRoleDto, convertWorldRoleDtoToWorldRole } from './world-role-dto';
import { WorldMemberModel } from '@/models/world-member-model';

type WorldMemberDto = {
  id: string;
  worldId: string;
  user: UserDto;
  role: WorldRoleDto;
};

function convertWorldMemberDtoToWorldMember(dto: WorldMemberDto): WorldMemberModel {
  return WorldMemberModel.new(
    dto.id,
    dto.worldId,
    convertUserDtoToUser(dto.user),
    convertWorldRoleDtoToWorldRole(dto.role)
  );
}

export type { WorldMemberDto };
export { convertWorldMemberDtoToWorldMember };
