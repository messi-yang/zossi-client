import { DirectionVo, PositionVo } from '@/models/valueObjects';

export default class UnitAgg {
  private itemId: string;

  private position: PositionVo;

  private direction: DirectionVo;

  constructor(itemId: string, position: PositionVo, direction: DirectionVo) {
    this.itemId = itemId;
    this.position = position;
    this.direction = direction;
  }

  static new(itemId: string, position: PositionVo, direction: DirectionVo): UnitAgg {
    return new UnitAgg(itemId, position, direction);
  }

  static newMockupUnit(): UnitAgg {
    return new UnitAgg('414b5703-91d1-42fc-a007-36dd8f25e329', PositionVo.new(0, 0), DirectionVo.newDown());
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

  public getDirection(): DirectionVo {
    return this.direction;
  }
}
