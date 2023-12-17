import { Axios } from 'axios';
import { ItemModel } from '@/models/world/item/item-model';
import { AxiosProvider } from '@/providers/axios-provider';
import { ItemDto, parseItemDto } from '../dtos/item-dto';

export class ItemApi {
  private axios: Axios;

  constructor() {
    this.axios = AxiosProvider.new(`${process.env.API_URL}/api/items`);
  }

  static new(): ItemApi {
    return new ItemApi();
  }

  async getItems(): Promise<ItemModel[]> {
    const { data } = await this.axios.get<ItemDto[]>('/');
    return data.map(parseItemDto);
  }

  async getItemsOfIds(itemIds: string[]): Promise<ItemModel[]> {
    const { data } = await this.axios.get<ItemDto[]>('/with-ids', {
      params: {
        ids: itemIds.join(','),
      },
    });
    return data.map(parseItemDto);
  }
}
