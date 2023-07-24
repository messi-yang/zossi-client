import { UserModel } from '@/models';

type UserDto = {
  id: string;
  emailAddress: string;
  username: string;
};

function parseUserDto(dto: UserDto): UserModel {
  return UserModel.new(dto.id, dto.emailAddress, dto.username);
}

export type { UserDto };
export { parseUserDto };
