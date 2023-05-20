import { Axios } from 'axios';
import { ItemDto, convertItemDtoToItem } from '@/apis/dtos';
import { ItemModel } from '@/models';
import { AxiosProvider } from '@/apis/axios-provider';

export class ItemService {
  private axios: Axios;

  constructor() {
    this.axios = AxiosProvider.newAxiosInstance(`${process.env.API_URL}/api/items`);
  }

  static new(): ItemService {
    return new ItemService();
  }

  async getItems(): Promise<ItemModel[]> {
    const { data } = await this.axios.get<ItemDto[]>('/');
    return data.map(convertItemDtoToItem);
  }
}
