import { Axios } from 'axios';
import { WorldMemberDto, parseWorldMemberDto } from '@/apis/dtos';
import { AxiosProvider } from '@/providers/axios-provider';
import { WorldMemberModel } from '@/models/iam/world-member-model';

export class WorldMemberApi {
  private axios: Axios;

  constructor() {
    this.axios = AxiosProvider.new(`${process.env.API_URL}/api/worlds`);
  }

  static new(): WorldMemberApi {
    return new WorldMemberApi();
  }

  async getWorldMembers(worldId: string): Promise<WorldMemberModel[]> {
    const { data } = await this.axios.get<WorldMemberDto[]>(`/${worldId}/members`);
    return data.map(parseWorldMemberDto);
  }
}
