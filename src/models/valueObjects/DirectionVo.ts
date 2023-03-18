type Direction = 0 | 1 | 2 | 3;

export default class DirectionVo {
  private direction: Direction;

  constructor(direction: Direction) {
    this.direction = direction;
  }

  static new(direction: Direction): DirectionVo {
    return new DirectionVo(direction);
  }

  static newDown(): DirectionVo {
    return new DirectionVo(0);
  }

  static newLeft(): DirectionVo {
    return new DirectionVo(3);
  }

  static newUp(): DirectionVo {
    return new DirectionVo(2);
  }

  static newRight(): DirectionVo {
    return new DirectionVo(1);
  }

  public toNumber(): number {
    return this.direction;
  }
}
