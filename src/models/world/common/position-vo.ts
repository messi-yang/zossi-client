/**
 * Position that has x and z axis, the values can only be integers.
 */
export class PositionVo {
  constructor(private x: number, private z: number, private y: number) {
    this.x = Math.round(x);
    this.z = Math.round(z);
    this.y = Math.round(y);
  }

  static create = (x: number, z: number, y: number = 0): PositionVo => new PositionVo(x, z, y);

  public isEqual(position: PositionVo): boolean {
    return this.x === position.getX() && this.z === position.getZ() && this.y === position.getY();
  }

  public getX(): number {
    return this.x;
  }

  public getZ(): number {
    return this.z;
  }

  public getY(): number {
    return this.y;
  }

  public getLeftPosition(): PositionVo {
    return PositionVo.create(this.x - 1, this.z, this.y);
  }

  public getTopPosition(): PositionVo {
    return PositionVo.create(this.x, this.z - 1, this.y);
  }

  public getRightPosition(): PositionVo {
    return PositionVo.create(this.x + 1, this.z, this.y);
  }

  public getBottomPosition(): PositionVo {
    return PositionVo.create(this.x, this.z + 1, this.y);
  }

  public shift(position: PositionVo): PositionVo {
    return PositionVo.create(this.x + position.getX(), this.z + position.getZ(), this.y + position.getY());
  }

  public toString(): string {
    return `${this.x},${this.z}`;
  }

  public toText(): string {
    return `(${this.x},${this.z})`;
  }
}
