import { Axios } from 'axios';
import { ItemDto, parseItemDto } from '@/apis/dtos';
import { ItemModel } from '@/models/world/item-model';
import { AxiosProvider } from '@/providers/axios-provider';

export class ItemApiService {
  private axios: Axios;

  constructor() {
    this.axios = AxiosProvider.new(`${process.env.API_URL}/api/items`);
  }

  static new(): ItemApiService {
    return new ItemApiService();
  }

  async getItems(): Promise<ItemModel[]> {
    const { data } = await this.axios.get<ItemDto[]>('/');
    return data.map(parseItemDto);
  }
}
