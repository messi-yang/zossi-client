export default class MapUnitVo {
  private itemId: string | null;

  constructor(itemId: string | null) {
    this.itemId = itemId;
  }

  static new(itemId: string | null): MapUnitVo {
    return new MapUnitVo(itemId);
  }

  public hasItemId(): boolean {
    return !!this.itemId;
  }
}
