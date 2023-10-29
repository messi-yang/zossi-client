import { v4 as uuidv4 } from 'uuid';
import { WorldRoleVo } from '../global/world-role-vo';
import { UserModel } from './user-model';

export class WorldMemberModel {
  constructor(private id: string, private worldId: string, private user: UserModel, private worldRole: WorldRoleVo) {}

  static new(id: string, worldId: string, user: UserModel, worldRole: WorldRoleVo): WorldMemberModel {
    return new WorldMemberModel(id, worldId, user, worldRole);
  }

  static mockup(): WorldMemberModel {
    return new WorldMemberModel(uuidv4(), uuidv4(), UserModel.mockup(), WorldRoleVo.new('admin'));
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
