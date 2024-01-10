/**
 * Position that has x and z axis, the values can only be integers.
 */
export class PositionVo {
  constructor(private x: number, private z: number) {
    this.x = Math.round(x);
    this.z = Math.round(z);
  }

  static new = (x: number, z: number): PositionVo => new PositionVo(x, z);

  public isEqual(position: PositionVo): boolean {
    return this.x === position.getX() && this.z === position.getZ();
  }

  public getX(): number {
    return this.x;
  }

  public getZ(): number {
    return this.z;
  }

  public getLeftPosition(): PositionVo {
    return PositionVo.new(this.x - 1, this.z);
  }

  public getTopPosition(): PositionVo {
    return PositionVo.new(this.x, this.z - 1);
  }

  public getRightPosition(): PositionVo {
    return PositionVo.new(this.x + 1, this.z);
  }

  public getBottomPosition(): PositionVo {
    return PositionVo.new(this.x, this.z + 1);
  }

  public shift(x: number, z: number): PositionVo {
    return PositionVo.new(this.x + x, this.z + z);
  }

  public toString(): string {
    return `${this.x},${this.z}`;
  }

  public toText(): string {
    return `(${this.x},${this.z})`;
  }
}
