import { UserModel } from '@/models/iam/user-model';

type UserDto = {
  id: string;
  emailAddress: string;
  username: string;
  friendlyName: string;
};

function parseUserDto(dto: UserDto): UserModel {
  return UserModel.new(dto.id, dto.emailAddress, dto.username, dto.friendlyName);
}

export type { UserDto };
export { parseUserDto };
