import axios, { Axios } from 'axios';
import { WorldDto, convertWorldDtoToUnit } from '@/apis/dtos';
import { WorldAgg } from '@/models/aggregates';

export class WorldService {
  private axios: Axios;

  constructor() {
    const schema = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    this.axios = axios.create({
      baseURL: `${schema}://${process.env.API_DOMAIN}/api/worlds`,
    });
  }

  static new(): WorldService {
    return new WorldService();
  }

  async getWorlds(): Promise<WorldAgg[]> {
    const { data } = await this.axios.get<WorldDto[]>('/');
    return data.map(convertWorldDtoToUnit);
  }
}
