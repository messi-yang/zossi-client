import { Axios } from 'axios';
import { ItemModel } from '@/models/world/item/item-model';
import { AxiosProvider } from '@/adapters/apis/axios-provider';
import { ItemDto, parseItemDto } from '../dtos/item-dto';

export class ItemApi {
  private axios: Axios;

  constructor() {
    this.axios = AxiosProvider.create(`${process.env.API_URL}/api/items`);
  }

  static create(): ItemApi {
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
