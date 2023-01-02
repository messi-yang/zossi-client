import LocationVo from './LocationVo';
import DimensionVo from './DimensionVo';
import OffsetVo from './OffsetVo';

export default class AreaVo {
  private from: LocationVo;

  private to: LocationVo;

  constructor(from: LocationVo, to: LocationVo) {
    this.from = from;
    this.to = to;
  }

  static new(from: LocationVo, to: LocationVo): AreaVo {
    return new AreaVo(from, to);
  }

  static newWithLocationAndDimension(location: LocationVo, dimension: DimensionVo): AreaVo {
    return new AreaVo(location, location.shift(dimension.getWidth() - 1, dimension.getHeight() - 1));
  }

  public isEqual(area: AreaVo): Boolean {
    return this.from.isEqual(area.getFrom()) && this.to.isEqual(area.getTo());
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

  public calculateOffsetWithArea(areaB: AreaVo): OffsetVo {
    return OffsetVo.new(this.from.getX() - areaB.getFrom().getX(), this.from.getY() - areaB.getFrom().getY());
  }
}
