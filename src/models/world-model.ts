import { v4 as uuidv4 } from 'uuid';
import { BoundModel } from './bound-model';
import { PositionModel } from './position-model';
import { UserModel } from './user-model';

export class WorldModel {
  constructor(private id: string, private name: string, private user: UserModel, private bound: BoundModel) {}

  static new = (id: string, name: string, user: UserModel, bound: BoundModel): WorldModel =>
    new WorldModel(id, name, user, bound);

  static mockup = (): WorldModel =>
    new WorldModel(
      uuidv4(),
      'Hello World',
      UserModel.mockup(),
      BoundModel.new(PositionModel.new(-10, -10), PositionModel.new(10, 10))
    );

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getUser(): UserModel {
    return this.user;
  }

  public getBound(): BoundModel {
    return this.bound;
  }
}
