import { PositionVo } from '@/models/valueObjects';

export default class UnitAgg {
  private itemId: number;

  private position: PositionVo;

  constructor(itemId: number, position: PositionVo) {
    this.itemId = itemId;
    this.position = position;
  }

  static new(itemId: number, position: PositionVo): UnitAgg {
    return new UnitAgg(itemId, position);
  }

  public getIdentifier(): string {
    return `${this.itemId},${this.position.getX()},${this.position.getZ()}`;
  }

  public getItemId(): number {
    return this.itemId;
  }

  public getPosition(): PositionVo {
    return this.position;
  }
}
