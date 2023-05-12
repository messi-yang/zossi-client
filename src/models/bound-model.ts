import { PositionModel } from './position-model';

export class BoundModel {
  private from: PositionModel;

  private to: PositionModel;

  constructor(from: PositionModel, to: PositionModel) {
    this.from = from;
    this.to = to;
  }

  static new(from: PositionModel, to: PositionModel): BoundModel {
    return new BoundModel(from, to);
  }

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

  public getCenter(): PositionModel {
    return PositionModel.new(
      Math.floor((this.from.getX() + this.to.getX()) / 2),
      Math.floor((this.from.getZ() + this.to.getZ()) / 2)
    );
  }
}
