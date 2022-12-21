export default class CoordinateValueObject {
  private x: number;

  private y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public isEqual(coordinate: CoordinateValueObject): boolean {
    return this.x === coordinate.getX() && this.y === coordinate.getY();
  }

  public getX(): number {
    return this.x;
  }

  public getY(): number {
    return this.y;
  }

  public shift(x: number, y: number): CoordinateValueObject {
    return new CoordinateValueObject(this.x + x, this.y + y);
  }
}
