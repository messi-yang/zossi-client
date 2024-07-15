import { Axios } from 'axios';
import { WorldModel } from '@/models/world/world/world-model';
import { AxiosProvider } from '@/adapters/apis/axios-provider';
import { WorldDto, parseWorldDto } from '../dtos/world-dto';

export class WorldApi {
  private axios: Axios;

  constructor() {
    this.axios = AxiosProvider.create(`${process.env.API_URL}/api/worlds`);
  }

  static create(): WorldApi {
    return new WorldApi();
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

  async deleteWorld(worldId: string): Promise<Error | null> {
    try {
      await this.axios.delete(`/${worldId}`);
      return null;
    } catch (e: any) {
      return e;
    }
  }
}
