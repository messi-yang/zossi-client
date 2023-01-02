import LocationVo from './LocationVo';
import MapSizeVo from './MapSizeVo';
import OffsetVo from './OffsetVo';

export default class MapRangeVo {
  private from: LocationVo;

  private to: LocationVo;

  constructor(from: LocationVo, to: LocationVo) {
    this.from = from;
    this.to = to;
  }

  static new(from: LocationVo, to: LocationVo): MapRangeVo {
    return new MapRangeVo(from, to);
  }

  static newWithLocationAndMapSize(location: LocationVo, mapSize: MapSizeVo): MapRangeVo {
    return new MapRangeVo(location, location.shift(mapSize.getWidth() - 1, mapSize.getHeight() - 1));
  }

  public isEqual(mapRange: MapRangeVo): Boolean {
    return this.from.isEqual(mapRange.getFrom()) && this.to.isEqual(mapRange.getTo());
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

  public calculateOffsetWithMapRange(mapRangeB: MapRangeVo): OffsetVo {
    return OffsetVo.new(this.from.getX() - mapRangeB.getFrom().getX(), this.from.getY() - mapRangeB.getFrom().getY());
  }
}
