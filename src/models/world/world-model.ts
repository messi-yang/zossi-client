import { v4 as uuidv4 } from 'uuid';
import { BoundModel } from './bound-model';
import { PositionModel } from './position-model';
import { UserModel } from '../iam/user-model';
import { DateModel } from '../general/date-model';

export class WorldModel {
  constructor(
    private id: string,
    private name: string,
    private user: UserModel,
    private bound: BoundModel,
    private createdAt: DateModel,
    private updatedAt: DateModel
  ) {}

  static new = (
    id: string,
    name: string,
    user: UserModel,
    bound: BoundModel,
    createdAt: DateModel,
    updatedAt: DateModel
  ): WorldModel => new WorldModel(id, name, user, bound, createdAt, updatedAt);

  static mockup = (): WorldModel =>
    new WorldModel(
      uuidv4(),
      'Hello World',
      UserModel.mockup(),
      BoundModel.new(PositionModel.new(-10, -10), PositionModel.new(10, 10)),
      DateModel.now(),
      DateModel.now()
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

  public getCreatedAt(): DateModel {
    return this.createdAt;
  }

  public getEditedAtCopy(): string {
    const [daysAgo, hoursAgo, minutesAgo, secondsAgo] = [
      this.updatedAt.getDaysAgo(),
      this.updatedAt.getHoursAgo(),
      this.updatedAt.getMinutesAgo(),
      this.updatedAt.getSecondsAgo(),
    ];
    if (secondsAgo < 60) {
      return `Edited ${secondsAgo} seconds ago`;
    } else if (minutesAgo < 60) {
      return `Edited ${minutesAgo} minutes ago`;
    } else if (hoursAgo < 24) {
      return `Edited ${hoursAgo} hours ago`;
    }
    return `Edited ${daysAgo} days ago`;
  }
}
