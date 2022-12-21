import axios from 'axios';
import type { Axios } from 'axios';
import { ItemAggregate } from '@/aggregates';
import { ItemDto } from '@/dtos';

export default class ItemApi {
  private axios: Axios;

  constructor() {
    const schema = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    this.axios = axios.create({
      baseURL: `${schema}://${process.env.API_DOMAIN}`,
    });
  }

  static newItemApi() {
    return new ItemApi();
  }

  public async fetchItems(): Promise<ItemAggregate[]> {
    const { data } = await this.axios.get<ItemDto[]>('/items');

    return data.map((itemDto) => ItemAggregate.newItemAggregate({ id: itemDto.id, name: itemDto.name }));
  }
}
