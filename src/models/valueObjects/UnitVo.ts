import LocationVo from './LocationVo';

export default class UnitVo {
  private itemId: number;

  private location: LocationVo;

  constructor(itemId: number, location: LocationVo) {
    this.itemId = itemId;
    this.location = location;
  }

  static new(itemId: number, location: LocationVo): UnitVo {
    return new UnitVo(itemId, location);
  }

  public getItemId(): number {
    return this.itemId;
  }

  public getLocation(): LocationVo {
    return this.location;
  }
}
