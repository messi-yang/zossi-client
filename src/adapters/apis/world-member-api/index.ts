import { Axios } from 'axios';
import { AxiosProvider } from '@/adapters/apis/axios-provider';
import { WorldMemberModel } from '@/models/iam/world-member-model';
import { WorldMemberDto, parseWorldMemberDto } from '../dtos/world-member-dto';

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
