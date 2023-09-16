import { Axios } from 'axios';
import { WorldDto, parseWorldDto } from '@/dtos';
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
    return data.map(parseWorldDto);
  }

  async getMyWorlds(): Promise<WorldModel[]> {
    const { data } = await this.axios.get<WorldDto[]>('/mine');
    return data.map(parseWorldDto);
  }

  async createWorld(name: string): Promise<WorldModel> {
    const { data } = await this.axios.post<WorldDto>('/', {
      name,
    });
    return parseWorldDto(data);
  }

  async deleteWorld(worldId: string): Promise<void> {
    await this.axios.delete(`/${worldId}`);
  }
}
