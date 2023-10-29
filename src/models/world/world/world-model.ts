import { v4 as uuidv4 } from 'uuid';
import { BoundVo } from '../common/bound-vo';
import { PositionVo } from '../common/position-vo';
import { UserModel } from '../../iam/user-model';
import { DateVo } from '../../general/date-vo';

export class WorldModel {
  constructor(
    private id: string,
    private name: string,
    private user: UserModel,
    private bound: BoundVo,
    private createdAt: DateVo,
    private updatedAt: DateVo
  ) {}

  static new = (
    id: string,
    name: string,
    user: UserModel,
    bound: BoundVo,
    createdAt: DateVo,
    updatedAt: DateVo
  ): WorldModel => new WorldModel(id, name, user, bound, createdAt, updatedAt);

  static mockup = (): WorldModel =>
    new WorldModel(
      uuidv4(),
      'Hello World',
      UserModel.mockup(),
      BoundVo.new(PositionVo.new(-10, -10), PositionVo.new(10, 10)),
      DateVo.now(),
      DateVo.now()
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

  public getBound(): BoundVo {
    return this.bound;
  }

  public getCreatedAt(): DateVo {
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
