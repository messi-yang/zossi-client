import { DateVo } from '@/models/general/date-vo';
import { PositionVo } from '../common/position-vo';
import { PlayerActionNameEnum } from './player-action-name-enum';
import { DirectionVo } from '../common/direction-vo';

export class PlayerActionVo {
  constructor(
    private readonly name: PlayerActionNameEnum,
    private readonly position: PositionVo,
    private readonly direction: DirectionVo,
    private readonly time: DateVo
  ) {}

  static new(name: PlayerActionNameEnum, position: PositionVo, direction: DirectionVo, time: DateVo): PlayerActionVo {
    return new PlayerActionVo(name, position, direction, time);
  }

  static newWalk(position: PositionVo, direction: DirectionVo, time: DateVo) {
    return new PlayerActionVo(PlayerActionNameEnum.Walk, position, direction, time);
  }

  static newStand(position: PositionVo, direction: DirectionVo, time: DateVo) {
    return new PlayerActionVo(PlayerActionNameEnum.Stand, position, direction, time);
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

  public getPosition(): PositionVo {
    return this.position;
  }

  public updatePosition(position: PositionVo): PlayerActionVo {
    return new PlayerActionVo(this.name, position, this.direction, this.time);
  }

  public getDirection(): DirectionVo {
    return this.direction;
  }

  public getTime(): DateVo {
    return this.time;
  }

  public updateTime(time: DateVo): PlayerActionVo {
    return new PlayerActionVo(this.name, this.position, this.direction, time);
  }
}
