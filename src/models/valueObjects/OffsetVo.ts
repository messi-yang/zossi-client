export default class OffsetVo {
  private x: number;

  private z: number;

  constructor(x: number, z: number) {
    this.x = x;
    this.z = z;
  }

  static new(x: number, z: number): OffsetVo {
    return new OffsetVo(x, z);
  }

  public getX(): number {
    return this.x;
  }

  public getZ(): number {
    return this.z;
  }
}
