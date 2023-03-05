export default class PositionVo {
  private x: number;

  private z: number;

  constructor(x: number, z: number) {
    this.x = x;
    this.z = z;
  }

  static new(x: number, z: number): PositionVo {
    return new PositionVo(x, z);
  }

  public isEqual(position: PositionVo): boolean {
    return this.x === position.getX() && this.z === position.getZ();
  }

  public getX(): number {
    return this.x;
  }

  public getZ(): number {
    return this.z;
  }
}
