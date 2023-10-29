import { PlayerActionEnum } from './player-action-enum';

export class PlayerActionVo {
  constructor(private action: PlayerActionEnum) {}

  static new(action: PlayerActionEnum): PlayerActionVo {
    return new PlayerActionVo(action);
  }

  static newWalk() {
    return new PlayerActionVo(PlayerActionEnum.Walk);
  }

  static newStand() {
    return new PlayerActionVo(PlayerActionEnum.Stand);
  }

  public isWalk() {
    return this.action === PlayerActionEnum.Walk;
  }

  public isStand() {
    return this.action === PlayerActionEnum.Stand;
  }
}
