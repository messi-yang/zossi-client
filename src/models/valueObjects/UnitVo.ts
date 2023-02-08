import LocationVo from './LocationVo';

export default class UnitVo {
  private itemId: string;

  private location: LocationVo;

  constructor(itemId: string, location: LocationVo) {
    this.itemId = itemId;
    this.location = location;
  }

  static new(itemId: string, location: LocationVo): UnitVo {
    return new UnitVo(itemId, location);
  }

  public getItemId(): string {
    return this.itemId;
  }

  public getLocation(): LocationVo {
    return this.location;
  }
}
