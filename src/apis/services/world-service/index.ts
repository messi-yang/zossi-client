import { Axios } from 'axios';
import { WorldDto, convertWorldDtoToUnit } from '@/apis/dtos';
import { WorldModel } from '@/models';
import { AxiosProvider } from '@/apis/axios-provider';

export class WorldService {
  private axios: Axios;

  constructor() {
    this.axios = AxiosProvider.newAxiosInstance(`${process.env.API_URL}/api/worlds`);
  }

  static new(): WorldService {
    return new WorldService();
  }

  async getWorlds(): Promise<WorldModel[]> {
    const { data } = await this.axios.get<WorldDto[]>('/');
    return data.map(convertWorldDtoToUnit);
  }
}
