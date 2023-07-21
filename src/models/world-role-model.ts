type Role = 'owner' | 'admin' | 'editor' | 'viewer';

export class WorldRoleModel {
  constructor(private role: Role) {}

  static new(role: Role) {
    return new WorldRoleModel(role);
  }

  public toString(): string {
    return this.role;
  }
}
