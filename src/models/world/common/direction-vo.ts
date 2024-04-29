import { DirectionEnum } from './direction-enum';

export class DirectionVo {
  constructor(private direction: DirectionEnum) {}

  static create = (direction: DirectionEnum): DirectionVo => new DirectionVo(direction);

  static newDown(): DirectionVo {
    return new DirectionVo(DirectionEnum.Down);
  }

  static newLeft(): DirectionVo {
    return new DirectionVo(DirectionEnum.Left);
  }

  static newUp(): DirectionVo {
    return new DirectionVo(DirectionEnum.Up);
  }

  static newRight(): DirectionVo {
    return new DirectionVo(DirectionEnum.Right);
  }

  public isEqual(direction: DirectionVo): boolean {
    return this.direction === direction.direction;
  }

  public toNumber(): DirectionEnum {
    return this.direction;
  }

  public isLeft(): boolean {
    return this.direction === DirectionEnum.Left;
  }

  public isUp(): boolean {
    return this.direction === DirectionEnum.Up;
  }

  public isRight(): boolean {
    return this.direction === DirectionEnum.Right;
  }

  public isDown(): boolean {
    return this.direction === DirectionEnum.Down;
  }

  public rotate(): DirectionVo {
    return DirectionVo.create((this.direction + 1) % 4);
  }

  public getOppositeDirection(): DirectionVo {
    return this.rotate().rotate();
  }
}
