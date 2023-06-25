import { v4 as uuidv4 } from 'uuid';
import { BoundModel } from './bound-model';
import { PositionModel } from './position-model';

export class WorldModel {
  constructor(private id: string, private name: string, private userId: string, private bound: BoundModel) {}

  static new = (id: string, name: string, userId: string, bound: BoundModel): WorldModel =>
    new WorldModel(id, name, userId, bound);

  static newMockupWorld = (): WorldModel =>
    new WorldModel(
      uuidv4(),
      'Hello World',
      uuidv4(),
      BoundModel.new(PositionModel.new(-10, -10), PositionModel.new(10, 10))
    );

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getBound(): BoundModel {
    return this.bound;
  }
}
