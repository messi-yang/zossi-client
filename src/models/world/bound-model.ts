import { PositionModel } from './position-model';

export class BoundModel {
  constructor(private from: PositionModel, private to: PositionModel) {}

  static new = (from: PositionModel, to: PositionModel): BoundModel => new BoundModel(from, to);

  public isEqual(bound: BoundModel): Boolean {
    return this.from.isEqual(bound.getFrom()) && this.to.isEqual(bound.getTo());
  }

  public getFrom(): PositionModel {
    return this.from;
  }

  public getTo(): PositionModel {
    return this.to;
  }

  public getWidth(): number {
    return this.to.getX() - this.from.getX() + 1;
  }

  public getHeight(): number {
    return this.to.getZ() - this.from.getZ() + 1;
  }

  public doesContainPosition(position: PositionModel): boolean {
    return (
      position.getX() >= this.from.getX() &&
      position.getX() <= this.to.getX() &&
      position.getZ() >= this.from.getZ() &&
      position.getZ() <= this.to.getZ()
    );
  }
}
