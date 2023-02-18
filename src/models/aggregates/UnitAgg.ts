import { LocationVo } from '@/models/valueObjects';

export default class UnitAgg {
  private itemId: number;

  private location: LocationVo;

  constructor(itemId: number, location: LocationVo) {
    this.itemId = itemId;
    this.location = location;
  }

  static new(itemId: number, location: LocationVo): UnitAgg {
    return new UnitAgg(itemId, location);
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
