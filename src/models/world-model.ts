import { v4 as uuidv4 } from 'uuid';

export class WorldModel {
  constructor(private id: string, private name: string, private userId: string) {}

  static new = (id: string, name: string, userId: string): WorldModel => new WorldModel(id, name, userId);

  static newMockupWorld = (): WorldModel => new WorldModel(uuidv4(), 'Hello World', uuidv4());

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
