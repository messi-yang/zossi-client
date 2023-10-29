import { DirectionVo } from './direction-vo';

export class PositionVo {
  constructor(private x: number, private z: number) {}

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

  public shift(x: number, z: number): PositionVo {
    return PositionVo.new(this.x + x, this.z + z);
  }

  public shiftByDirection(direction: DirectionVo, distance: number): PositionVo {
    if (direction.isUp()) {
      return this.shift(0, -distance);
    } else if (direction.isRight()) {
      return this.shift(distance, 0);
    } else if (direction.isDown()) {
      return this.shift(0, distance);
    } else if (direction.isLeft()) {
      return this.shift(-distance, 0);
    } else {
      return this.shift(0, distance);
    }
  }

  public toString(): string {
    return `${this.x},${this.z}`;
  }

  public getPositionText(): string {
    return `(${this.x}, ${this.z})`;
  }
}
