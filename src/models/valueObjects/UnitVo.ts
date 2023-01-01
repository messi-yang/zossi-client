export default class UnitVo {
  private itemId: string | null;

  constructor(itemId: string | null) {
    this.itemId = itemId;
  }

  public hasItemId(): boolean {
    return !!this.itemId;
  }
}
