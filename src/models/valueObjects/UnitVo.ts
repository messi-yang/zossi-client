export default class UnitVo {
  private itemId: string | null;

  constructor(itemId: string | null) {
    this.itemId = itemId;
  }

  static new(itemId: string | null): UnitVo {
    return new UnitVo(itemId);
  }

  public hasItemId(): boolean {
    return !!this.itemId;
  }
}
