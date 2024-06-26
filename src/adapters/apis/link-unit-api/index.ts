import { Axios } from 'axios';
import { AxiosProvider } from '@/adapters/apis/axios-provider';

export class LinkUnitApi {
  private axios: Axios;

  constructor() {
    this.axios = AxiosProvider.create(`${process.env.API_URL}/api/link-units`);
  }

  static create(): LinkUnitApi {
    return new LinkUnitApi();
  }

  async getLinkUnitUrl(id: string): Promise<string> {
    const { data } = await this.axios.get<{ url: string }>(`/${id}`);
    return data.url;
  }
}
