import { DirectionEnum } from './direction-enum';

export class DirectionModel {
  constructor(private direction: DirectionEnum) {}

  static new = (direction: DirectionEnum): DirectionModel => new DirectionModel(direction);

  static newDown(): DirectionModel {
    return new DirectionModel(DirectionEnum.Down);
  }

  static newLeft(): DirectionModel {
    return new DirectionModel(DirectionEnum.Left);
  }

  static newUp(): DirectionModel {
    return new DirectionModel(DirectionEnum.Up);
  }

  static newRight(): DirectionModel {
    return new DirectionModel(DirectionEnum.Right);
  }

  public isEqual(direction: DirectionModel): boolean {
    return this.direction === direction.direction;
  }

  public toNumber(): number {
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

  public rotate(): DirectionModel {
    return DirectionModel.new((this.direction + 1) % 4);
  }

  public getOppositeDirection(): DirectionModel {
    return this.rotate().rotate();
  }
}
