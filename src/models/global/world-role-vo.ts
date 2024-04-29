type Role = 'owner' | 'admin' | 'editor' | 'viewer';

export class WorldRoleVo {
  constructor(private role: Role) {}

  static create(role: Role) {
    return new WorldRoleVo(role);
  }

  public toString(): string {
    return this.role;
  }
}
