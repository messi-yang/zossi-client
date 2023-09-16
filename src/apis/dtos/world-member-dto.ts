import { UserDto, parseUserDto } from './user-dto';
import { WorldRoleDto, parseWorldRoleDto } from './world-role-dto';
import { WorldMemberModel } from '@/models/iam/world-member-model';

type WorldMemberDto = {
  id: string;
  worldId: string;
  user: UserDto;
  role: WorldRoleDto;
};

function parseWorldMemberDto(dto: WorldMemberDto): WorldMemberModel {
  return WorldMemberModel.new(dto.id, dto.worldId, parseUserDto(dto.user), parseWorldRoleDto(dto.role));
}

export type { WorldMemberDto };
export { parseWorldMemberDto };
