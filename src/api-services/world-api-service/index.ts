import { Axios } from 'axios';
import { WorldDto, convertWorldDtoToWorld } from '@/dtos';
import { WorldModel } from '@/models';
import { AxiosProvider } from '@/providers/axios-provider';

export class WorldApiService {
  private axios: Axios;

  constructor() {
    this.axios = AxiosProvider.new(`${process.env.API_URL}/api/worlds`);
  }

  static new(): WorldApiService {
    return new WorldApiService();
  }

  async queryWorlds(limit: number, offset: number): Promise<WorldModel[]> {
    const { data } = await this.axios.get<WorldDto[]>('/', {
      params: {
        limit,
        offset,
      },
    });
    return data.map(convertWorldDtoToWorld);
  }
}
