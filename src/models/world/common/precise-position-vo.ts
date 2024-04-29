import { DirectionVo } from './direction-vo';
import { PositionVo } from './position-vo';

/**
 * Precise position that has x and z axis, the values can be float numbers.
 */
export class PrecisePositionVo {
  constructor(private x: number, private z: number) {
    this.x = Math.round(x * 100) / 100;
    this.z = Math.round(z * 100) / 100;
  }

  static create = (x: number, z: number): PrecisePositionVo => new PrecisePositionVo(x, z);

  public isEqual(position: PrecisePositionVo): boolean {
    return this.x === position.getX() && this.z === position.getZ();
  }

  public getX(): number {
    return this.x;
  }

  public getZ(): number {
    return this.z;
  }

  public shift(x: number, z: number): PrecisePositionVo {
    return PrecisePositionVo.create(this.x + x, this.z + z);
  }

  public shiftByDirection(direction: DirectionVo, distance: number): PrecisePositionVo {
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

  public toPosition(): PositionVo {
    return PositionVo.create(this.x, this.z);
  }

  public toString(): string {
    return `${this.x},${this.z}`;
  }

  public toText(): string {
    return `(${this.x}, ${this.z})`;
  }
}
