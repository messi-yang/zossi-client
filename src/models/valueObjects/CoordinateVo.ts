export default class CoordinateVo {
  private x: number;

  private y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static new(x: number, y: number): CoordinateVo {
    return new CoordinateVo(x, y);
  }

  public isEqual(coordinate: CoordinateVo): boolean {
    return this.x === coordinate.getX() && this.y === coordinate.getY();
  }

  public getX(): number {
    return this.x;
  }

  public getY(): number {
    return this.y;
  }

  public shift(x: number, y: number): CoordinateVo {
    return new CoordinateVo(this.x + x, this.y + y);
  }
}
