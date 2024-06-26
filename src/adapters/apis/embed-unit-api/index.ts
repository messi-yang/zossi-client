import { Axios } from 'axios';
import { AxiosProvider } from '@/adapters/apis/axios-provider';

export class EmbedUnitApi {
  private axios: Axios;

  constructor() {
    this.axios = AxiosProvider.create(`${process.env.API_URL}/api/embed-units`);
  }

  static create(): EmbedUnitApi {
    return new EmbedUnitApi();
  }

  async getEmbedUnitEmbedCode(id: string): Promise<string> {
    const { data } = await this.axios.get<{ embedCode: string }>(`/${id}`);
    return data.embedCode;
  }
}
