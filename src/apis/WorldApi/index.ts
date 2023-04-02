import axios, { Axios } from 'axios';
import { WorldDto, convertWorldDtoToUnit } from '@/dtos';
import { WorldAgg } from '@/models/aggregates';

export default class WorldApi {
  private axios: Axios;

  constructor() {
    const schema = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    this.axios = axios.create({
      baseURL: `${schema}://${process.env.API_DOMAIN}/api/worlds`,
    });
  }

  static new(): WorldApi {
    return new WorldApi();
  }

  async getWorlds(): Promise<WorldAgg[]> {
    const { data } = await this.axios.get<WorldDto[]>('/');
    return data.map(convertWorldDtoToUnit);
  }
}
