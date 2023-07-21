import { v4 as uuidv4 } from 'uuid';
import { WorldRoleModel } from './world-role-model';

export class WorldMemberModel {
  constructor(private id: string, private worldId: string, private userId: string, private worldRole: WorldRoleModel) {}

  static new(id: string, worldId: string, userId: string, worldRole: WorldRoleModel): WorldMemberModel {
    return new WorldMemberModel(id, worldId, userId, worldRole);
  }

  static mockup(): WorldMemberModel {
    return new WorldMemberModel(uuidv4(), uuidv4(), uuidv4(), WorldRoleModel.new('admin'));
  }

  public getId(): string {
    return this.id;
  }

  public getWorldId(): string {
    return this.worldId;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getWorldRole(): WorldRoleModel {
    return this.worldRole;
  }
}
