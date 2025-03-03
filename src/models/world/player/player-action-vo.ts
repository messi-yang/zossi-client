import { PlayerActionNameEnum } from './player-action-name-enum';
import { DirectionVo } from '../common/direction-vo';

export class PlayerActionVo {
  constructor(private readonly name: PlayerActionNameEnum, private readonly direction: DirectionVo) {}

  static create(name: PlayerActionNameEnum, direction: DirectionVo): PlayerActionVo {
    return new PlayerActionVo(name, direction);
  }

  static newWalk(direction: DirectionVo) {
    return new PlayerActionVo(PlayerActionNameEnum.Walk, direction);
  }

  static newStand(direction: DirectionVo) {
    return new PlayerActionVo(PlayerActionNameEnum.Stand, direction);
  }

  static newTeleport(direction: DirectionVo) {
    return new PlayerActionVo(PlayerActionNameEnum.Teleport, direction);
  }

  static newTeleported(direction: DirectionVo) {
    return new PlayerActionVo(PlayerActionNameEnum.Teleported, direction);
  }

  public isWalk() {
    return this.name === PlayerActionNameEnum.Walk;
  }

  public isStand() {
    return this.name === PlayerActionNameEnum.Stand;
  }

  public isTeleport() {
    return this.name === PlayerActionNameEnum.Teleport;
  }

  public isTeleported() {
    return this.name === PlayerActionNameEnum.Teleported;
  }

  public getName(): PlayerActionNameEnum {
    return this.name;
  }

  public getDirection(): DirectionVo {
    return this.direction;
  }
}
