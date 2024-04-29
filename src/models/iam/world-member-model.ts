import { WorldRoleVo } from '../global/world-role-vo';
import { UserModel } from './user-model';
import { generateUuidV4 } from '@/utils/uuid';

export class WorldMemberModel {
  constructor(private id: string, private worldId: string, private user: UserModel, private worldRole: WorldRoleVo) {}

  static create(id: string, worldId: string, user: UserModel, worldRole: WorldRoleVo): WorldMemberModel {
    return new WorldMemberModel(id, worldId, user, worldRole);
  }

  static createMock(): WorldMemberModel {
    return new WorldMemberModel(
      generateUuidV4(),
      generateUuidV4(),
      UserModel.createMock(),
      WorldRoleVo.create('admin')
    );
  }

  public getId(): string {
    return this.id;
  }

  public getWorldId(): string {
    return this.worldId;
  }

  public getUser(): UserModel {
    return this.user;
  }

  public getWorldRole(): WorldRoleVo {
    return this.worldRole;
  }
}
