import { v4 as uuidv4 } from 'uuid';
import { WorldRoleModel } from './world-role-model';
import { UserModel } from './user-model';

export class WorldMemberModel {
  constructor(
    private id: string,
    private worldId: string,
    private user: UserModel,
    private worldRole: WorldRoleModel
  ) {}

  static new(id: string, worldId: string, user: UserModel, worldRole: WorldRoleModel): WorldMemberModel {
    return new WorldMemberModel(id, worldId, user, worldRole);
  }

  static mockup(): WorldMemberModel {
    return new WorldMemberModel(uuidv4(), uuidv4(), UserModel.mockup(), WorldRoleModel.new('admin'));
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

  public getWorldRole(): WorldRoleModel {
    return this.worldRole;
  }
}
