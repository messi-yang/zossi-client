import axios from 'axios';
import type { Axios } from 'axios';
import { ItemAgg } from '@/models/aggregates';
import { ItemDto } from '@/apis/dtos';

export default class ItemHttpApi {
  private axios: Axios;

  constructor() {
    const schema = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    this.axios = axios.create({
      baseURL: `${schema}://${process.env.API_DOMAIN}`,
    });
  }

  static newItemHttpApi() {
    return new ItemHttpApi();
  }

  public async fetchItems(): Promise<ItemAgg[]> {
    const { data } = await this.axios.get<ItemDto[]>('/items');

    return data.map((itemDto) => ItemAgg.newItemAgg({ id: itemDto.id, name: itemDto.name }));
  }
}
