export default class MapUnitVo {
  private itemId: string | null;

  constructor(itemId: string | null) {
    this.itemId = itemId;
  }

  static new(itemId: string | null): MapUnitVo {
    return new MapUnitVo(itemId);
  }

  public getItemId(): string | null {
    return this.itemId;
  }
}
