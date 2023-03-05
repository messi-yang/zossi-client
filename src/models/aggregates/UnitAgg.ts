import { PositionVo } from '@/models/valueObjects';

export default class UnitAgg {
  private itemId: string;

  private position: PositionVo;

  constructor(itemId: string, position: PositionVo) {
    this.itemId = itemId;
    this.position = position;
  }

  static new(itemId: string, position: PositionVo): UnitAgg {
    return new UnitAgg(itemId, position);
  }

  public getIdentifier(): string {
    return `${this.itemId},${this.position.getX()},${this.position.getZ()}`;
  }

  public getItemId(): string {
    return this.itemId;
  }

  public getPosition(): PositionVo {
    return this.position;
  }
}
