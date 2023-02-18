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

  public getIdentifier(): string {
    return `${this.itemId},${this.location.getX()},${this.location.getZ()}`;
  }

  public getItemId(): number {
    return this.itemId;
  }

  public getLocation(): LocationVo {
    return this.location;
  }
}
