import { DirectionVo } from './direction-vo';
import { PositionVo } from './position-vo';

/**
 * Precise position that has x and z axis, the values can be float numbers.
 */
export class PrecisePositionVo {
  constructor(private x: number, private z: number, private y: number) {
    this.x = Math.round(x * 100) / 100;
    this.z = Math.round(z * 100) / 100;
    this.y = Math.round(y * 100) / 100;
  }

  static create = (x: number, z: number, y: number = 0): PrecisePositionVo => new PrecisePositionVo(x, z, y);

  public isEqual(position: PrecisePositionVo): boolean {
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

  public shift(position: PositionVo | PrecisePositionVo): PrecisePositionVo {
    return PrecisePositionVo.create(this.x + position.getX(), this.z + position.getZ(), this.y + position.getY());
  }

  public shiftByDirection(direction: DirectionVo, distance: number): PrecisePositionVo {
    if (direction.isUp()) {
      return this.shift(PrecisePositionVo.create(0, -distance, this.y));
    } else if (direction.isRight()) {
      return this.shift(PrecisePositionVo.create(distance, 0, this.y));
    } else if (direction.isDown()) {
      return this.shift(PrecisePositionVo.create(0, distance, this.y));
    } else if (direction.isLeft()) {
      return this.shift(PrecisePositionVo.create(-distance, 0, this.y));
    } else {
      return this.shift(PrecisePositionVo.create(0, distance, this.y));
    }
  }

  public toPosition(): PositionVo {
    return PositionVo.create(this.x, this.z, this.y);
  }

  public toString(): string {
    return `${this.x},${this.z}`;
  }

  public toText(): string {
    return `(${this.x}, ${this.z})`;
  }
}
