export default class WorldAgg {
  private id: string;

  private name: string;

  private userId: string;

  constructor(id: string, name: string, userId: string) {
    this.id = id;
    this.name = name;
    this.userId = userId;
  }

  static new(id: string, name: string, userId: string): WorldAgg {
    return new WorldAgg(id, name, userId);
  }

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
