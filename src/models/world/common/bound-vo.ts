import { PositionVo } from './position-vo';

export class BoundVo {
  constructor(private from: PositionVo, private to: PositionVo) {}

  static new = (from: PositionVo, to: PositionVo): BoundVo => new BoundVo(from, to);

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

  public getHeight(): number {
    return this.to.getZ() - this.from.getZ() + 1;
  }

  public doesContainPosition(position: PositionVo): boolean {
    return (
      position.getX() >= this.from.getX() &&
      position.getX() <= this.to.getX() &&
      position.getZ() >= this.from.getZ() &&
      position.getZ() <= this.to.getZ()
    );
  }
}
