export default class LocationVo {
  private x: number;

  private y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static new(x: number, y: number): LocationVo {
    return new LocationVo(x, y);
  }

  public isEqual(location: LocationVo): boolean {
    return this.x === location.getX() && this.y === location.getY();
  }

  public getX(): number {
    return this.x;
  }

  public getY(): number {
    return this.y;
  }

  public shift(x: number, y: number): LocationVo {
    return new LocationVo(this.x + x, this.y + y);
  }
}
