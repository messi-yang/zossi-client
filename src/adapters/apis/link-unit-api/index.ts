import { Axios } from 'axios';
import { AxiosProvider } from '@/adapters/apis/axios-provider';
import { PositionVo } from '@/models/world/common/position-vo';
import { newPositionDto } from '../dtos/position-dto';

export class LinkUnitApi {
  private axios: Axios;

  constructor() {
    this.axios = AxiosProvider.new(`${process.env.API_URL}/api/link-units`);
  }

  static new(): LinkUnitApi {
    return new LinkUnitApi();
  }

  async getLinkUnitUrl(worldId: string, position: PositionVo): Promise<string> {
    const { data } = await this.axios.post<{ url: string }>('/get-url', {
      worldId,
      position: newPositionDto(position),
    });
    return data.url;
  }
}
