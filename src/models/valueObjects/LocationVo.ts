export default class LocationVo {
  private x: number;

  private z: number;

  constructor(x: number, z: number) {
    this.x = x;
    this.z = z;
  }

  static new(x: number, z: number): LocationVo {
    return new LocationVo(x, z);
  }

  public isEqual(location: LocationVo): boolean {
    return this.x === location.getX() && this.z === location.getZ();
  }

  public getX(): number {
    return this.x;
  }

  public getZ(): number {
    return this.z;
  }

  public getRelativeLocation(location: LocationVo): LocationVo {
    return new LocationVo(this.x - location.getX(), this.z - location.getZ());
  }

  public shift(x: number, z: number): LocationVo {
    return new LocationVo(this.x + x, this.z + z);
  }
}
