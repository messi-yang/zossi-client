import axios, { Axios } from 'axios';
import { ItemDto, convertItemDtoToItem } from '@/dtos';
import { ItemAgg } from '@/models/aggregates';

export default class ItemApi {
  private axios: Axios;

  constructor() {
    const schema = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    this.axios = axios.create({
      baseURL: `${schema}://${process.env.API_DOMAIN}/api/items`,
    });
  }

  static new(): ItemApi {
    return new ItemApi();
  }

  async getItems(): Promise<ItemAgg[]> {
    const { data } = await this.axios.get<ItemDto[]>('/');
    return data.map(convertItemDtoToItem);
  }
}
