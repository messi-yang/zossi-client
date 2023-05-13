type Direction = 0 | 1 | 2 | 3;

export class DirectionModel {
  constructor(private direction: Direction) {}

  static new = (direction: Direction): DirectionModel => new DirectionModel(direction);

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
}