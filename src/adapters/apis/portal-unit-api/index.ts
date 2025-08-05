import { Axios } from 'axios';
import { AxiosProvider } from '@/adapters/apis/axios-provider';
import { PositionVo } from '@/models/world/common/position-vo';
import { PositionDto } from '../dtos/position-dto';
import { PortalUnitModel } from '@/models/world/unit/portal-unit-model';
import { parsePortalUnitDto, PortalUnitDto } from '../dtos/unit-dto';

export class PortalUnitApi {
  private axios: Axios;

  constructor() {
    this.axios = AxiosProvider.create(`${process.env.API_URL}/api/portal-units`);
  }

  static create(): PortalUnitApi {
    return new PortalUnitApi();
  }

  async getPortalUnitTargetPosition(id: string): Promise<PositionVo | null> {
    const { data } = await this.axios.get<{ position: PositionDto } | null>(`/${id}/target-unit`);
    if (!data) return null;
    return PositionVo.create(data.position.x, data.position.z);
  }

  async query({
    worldId,
    limit = 10,
    offset = 0,
    hasTargetUnit,
  }: {
    worldId: string;
    limit?: number;
    offset?: number;
    hasTargetUnit?: boolean;
  }): Promise<PortalUnitModel[]> {
    const { data } = await this.axios.get<PortalUnitDto[]>(`/`, {
      params: {
        world_id: worldId,
        limit,
        offset,
        has_target_unit: hasTargetUnit,
      },
    });
    return data.map(parsePortalUnitDto);
  }
}
