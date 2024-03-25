import { DateVo } from '@/models/global/date-vo';
import { PlayerActionNameEnum } from './player-action-name-enum';
import { DirectionVo } from '../common/direction-vo';
import { PrecisePositionVo } from '../common/precise-position-vo';

export class PlayerActionVo {
  constructor(
    private readonly name: PlayerActionNameEnum,
    private readonly precisePosition: PrecisePositionVo,
    private readonly direction: DirectionVo,
    private readonly time: DateVo
  ) {}

  static new(
    name: PlayerActionNameEnum,
    precisePosition: PrecisePositionVo,
    direction: DirectionVo,
    time: DateVo
  ): PlayerActionVo {
    return new PlayerActionVo(name, precisePosition, direction, time);
  }

  static newWalk(precisePosition: PrecisePositionVo, direction: DirectionVo) {
    return new PlayerActionVo(PlayerActionNameEnum.Walk, precisePosition, direction, DateVo.now());
  }

  static newStand(precisePosition: PrecisePositionVo, direction: DirectionVo) {
    return new PlayerActionVo(PlayerActionNameEnum.Stand, precisePosition, direction, DateVo.now());
  }

  public isWalk() {
    return this.name === PlayerActionNameEnum.Walk;
  }

  public isStand() {
    return this.name === PlayerActionNameEnum.Stand;
  }

  public getName(): PlayerActionNameEnum {
    return this.name;
  }

  public getPrecisePosition(): PrecisePositionVo {
    return this.precisePosition;
  }

  public updatePrecisePosition(precisePosition: PrecisePositionVo): PlayerActionVo {
    return new PlayerActionVo(this.name, precisePosition, this.direction, this.time);
  }

  public getDirection(): DirectionVo {
    return this.direction;
  }

  public getTime(): DateVo {
    return this.time;
  }

  public updateTime(time: DateVo): PlayerActionVo {
    return new PlayerActionVo(this.name, this.precisePosition, this.direction, time);
  }
}
