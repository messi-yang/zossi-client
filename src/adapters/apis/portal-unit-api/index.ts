import { Axios } from 'axios';
import { AxiosProvider } from '@/adapters/apis/axios-provider';
import { PositionVo } from '@/models/world/common/position-vo';
import { PositionDto } from '../dtos/position-dto';

export class PortalUnitApi {
  private axios: Axios;

  constructor() {
    this.axios = AxiosProvider.create(`${process.env.API_URL}/api/portal-units`);
  }

  static create(): PortalUnitApi {
    return new PortalUnitApi();
  }

  async getPortalUnitTargetPosition(id: string): Promise<PositionVo | null> {
    const { data } = await this.axios.get<{ position: PositionDto | null }>(`/${id}/target-unit`);
    return data.position ? PositionVo.create(data.position.x, data.position.z) : null;
  }
}
