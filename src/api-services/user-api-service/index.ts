import { Axios } from 'axios';
import { AxiosProvider } from '@/providers/axios-provider';
import { UserDto, convertUserDtoToUser } from '@/dtos/user-dto';

export class UserApiService {
  private axios: Axios;

  constructor() {
    this.axios = AxiosProvider.new(`${process.env.API_URL}/api/users`);
  }

  static new(): UserApiService {
    return new UserApiService();
  }

  async getMyUser() {
    const { data } = await this.axios.get<UserDto>('/me');
    return convertUserDtoToUser(data);
  }
}
