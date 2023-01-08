import LocationVo from './LocationVo';
import MapSizeVo from './MapSizeVo';
import OffsetVo from './OffsetVo';

export default class ExtentVo {
  private from: LocationVo;

  private to: LocationVo;

  constructor(from: LocationVo, to: LocationVo) {
    this.from = from;
    this.to = to;
  }

  static new(from: LocationVo, to: LocationVo): ExtentVo {
    return new ExtentVo(from, to);
  }

  static newWithLocationAndMapSize(location: LocationVo, mapSize: MapSizeVo): ExtentVo {
    return new ExtentVo(location, location.shift(mapSize.getWidth() - 1, mapSize.getHeight() - 1));
  }

  public isEqual(extent: ExtentVo): Boolean {
    return this.from.isEqual(extent.getFrom()) && this.to.isEqual(extent.getTo());
  }

  public getMapSize(): MapSizeVo {
    return MapSizeVo.new(this.to.getX() - this.from.getX() + 1, this.to.getY() - this.from.getY() + 1);
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

  public calculateOffsetWithExtent(extentB: ExtentVo): OffsetVo {
    return OffsetVo.new(this.from.getX() - extentB.getFrom().getX(), this.from.getY() - extentB.getFrom().getY());
  }
}
