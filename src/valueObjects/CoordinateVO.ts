export default class CoordinateVO {
  private x: number;

  private y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public isEqual(coordinate: CoordinateVO): boolean {
    return this.x === coordinate.getX() && this.y === coordinate.getY();
  }

  public getX(): number {
    return this.x;
  }

  public getY(): number {
    return this.y;
  }

  public shift(x: number, y: number): CoordinateVO {
    return new CoordinateVO(this.x + x, this.y + y);
  }
}
