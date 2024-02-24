import { BoundVo } from '../common/bound-vo';
import { PositionVo } from '../common/position-vo';
import { DateVo } from '../../global/date-vo';
import { generateUuidV4 } from '@/utils/uuid';

export class WorldModel {
  constructor(
    private id: string,
    private name: string,
    private bound: BoundVo,
    private createdAt: DateVo,
    private updatedAt: DateVo
  ) {}

  static new = (id: string, name: string, bound: BoundVo, createdAt: DateVo, updatedAt: DateVo): WorldModel =>
    new WorldModel(id, name, bound, createdAt, updatedAt);

  static mockup = (): WorldModel =>
    new WorldModel(
      generateUuidV4(),
      'Hello World',
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
