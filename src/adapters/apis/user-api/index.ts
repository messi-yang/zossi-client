import { Axios } from 'axios';
import { AxiosProvider } from '@/adapters/apis/axios-provider';
import { UserDto, parseUserDto } from '@/adapters/apis/dtos/user-dto';

export class UserApi {
  private axios: Axios;

  constructor() {
    this.axios = AxiosProvider.create(`${process.env.API_URL}/api/users`);
  }

  static create(): UserApi {
    return new UserApi();
  }

  async getMyUser() {
    const { data } = await this.axios.get<UserDto>('/me');
    return parseUserDto(data);
  }

  async updateMyUser(username: string, friendlyName: string) {
    const { data } = await this.axios.patch<UserDto>('/me', { username, friendlyName });
    return parseUserDto(data);
  }
}
