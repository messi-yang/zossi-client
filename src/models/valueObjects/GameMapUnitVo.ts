export default class GameMapUnitVo {
  private itemId: string | null;

  constructor(itemId: string | null) {
    this.itemId = itemId;
  }

  static new(itemId: string | null): GameMapUnitVo {
    return new GameMapUnitVo(itemId);
  }

  public hasItemId(): boolean {
    return !!this.itemId;
  }
}
