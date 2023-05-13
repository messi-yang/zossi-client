export class WorldModel {
  constructor(private id: string, private name: string, private userId: string) {}

  static new = (id: string, name: string, userId: string): WorldModel => new WorldModel(id, name, userId);

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getUserId(): string {
    return this.userId;
  }
}
