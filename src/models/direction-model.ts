export class DirectionModel {
  constructor(private direction: number) {}

  static new = (direction: number): DirectionModel => new DirectionModel(direction % 4);

  static newDown(): DirectionModel {
    return new DirectionModel(0);
  }

  static newLeft(): DirectionModel {
    return new DirectionModel(3);
  }

  static newUp(): DirectionModel {
    return new DirectionModel(2);
  }

  static newRight(): DirectionModel {
    return new DirectionModel(1);
  }

  public toNumber(): number {
    return this.direction;
  }

  public isLeft(): boolean {
    return this.direction === 3;
  }

  public isUp(): boolean {
    return this.direction === 2;
  }

  public isRight(): boolean {
    return this.direction === 1;
  }

  public isDown(): boolean {
    return this.direction === 0;
  }

  public rotate(): DirectionModel {
    return DirectionModel.new(this.direction + 1);
  }

  public getOppositeDirection(): DirectionModel {
    return this.rotate().rotate();
  }
}
