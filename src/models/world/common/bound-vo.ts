import { PositionVo } from './position-vo';
import { PrecisePositionVo } from './precise-position-vo';

export class BoundVo {
  constructor(private from: PositionVo, private to: PositionVo) {}

  static create = (from: PositionVo, to: PositionVo): BoundVo => new BoundVo(from, to);

  public isEqual(bound: BoundVo): Boolean {
    return this.from.isEqual(bound.getFrom()) && this.to.isEqual(bound.getTo());
  }

  public getFrom(): PositionVo {
    return this.from;
  }

  public getTo(): PositionVo {
    return this.to;
  }

  public getWidth(): number {
    return this.to.getX() - this.from.getX() + 1;
  }

  public getDepth(): number {
    return this.to.getZ() - this.from.getZ() + 1;
  }

  public getCenterPrecisePosition(): PrecisePositionVo {
    return PrecisePositionVo.create((this.to.getX() + this.from.getX()) / 2, (this.to.getZ() + this.from.getZ()) / 2);
  }

  public doesContainPosition(position: PositionVo): boolean {
    return (
      position.getX() >= this.from.getX() &&
      position.getX() <= this.to.getX() &&
      position.getZ() >= this.from.getZ() &&
      position.getZ() <= this.to.getZ()
    );
  }

  public iterate(cb: (position: PositionVo) => void): void {
    for (let x = this.from.getX(); x <= this.to.getX(); x += 1) {
      for (let z = this.from.getZ(); z <= this.to.getZ(); z += 1) {
        cb(PositionVo.create(x, z));
      }
    }
  }
}
