import LocationVo from './LocationVo';
import DimensionVo from './DimensionVo';
import OffsetVo from './OffsetVo';

export default class RangeVo {
  private from: LocationVo;

  private to: LocationVo;

  constructor(from: LocationVo, to: LocationVo) {
    this.from = from;
    this.to = to;
  }

  static new(from: LocationVo, to: LocationVo): RangeVo {
    return new RangeVo(from, to);
  }

  static newWithLocationAndDimension(location: LocationVo, dimension: DimensionVo): RangeVo {
    return new RangeVo(location, location.shift(dimension.getWidth() - 1, dimension.getHeight() - 1));
  }

  public isEqual(range: RangeVo): Boolean {
    return this.from.isEqual(range.getFrom()) && this.to.isEqual(range.getTo());
  }

  public getDimension(): DimensionVo {
    return DimensionVo.new(this.to.getX() - this.from.getX() + 1, this.to.getY() - this.from.getY() + 1);
  }

  public getFrom(): LocationVo {
    return this.from;
  }

  public getTo(): LocationVo {
    return this.to;
  }

  public getWidth(): number {
    return this.to.getX() - this.from.getX() + 1;
  }

  public getHeight(): number {
    return this.to.getY() - this.from.getY() + 1;
  }

  public calculateOffsetWithRange(rangeB: RangeVo): OffsetVo {
    return OffsetVo.new(this.from.getX() - rangeB.getFrom().getX(), this.from.getY() - rangeB.getFrom().getY());
  }
}
