import { v4 as uuidv4 } from 'uuid';
import { PositionVo, DirectionVo } from '@/models/valueObjects';

export default class PlayerAgg {
  private id: string;

  private name: string;

  private position: PositionVo;

  private direction: DirectionVo;

  private heldItemId: string | null;

  constructor(params: {
    id: string;
    name: string;
    position: PositionVo;
    direction: DirectionVo;
    heldItemId: string | null;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.position = params.position;
    this.direction = params.direction;
    this.heldItemId = params.heldItemId;
  }

  static new(params: {
    id: string;
    name: string;
    position: PositionVo;
    direction: DirectionVo;
    heldItemId: string | null;
  }): PlayerAgg {
    return new PlayerAgg(params);
  }

  static newMockupPlayer(): PlayerAgg {
    return PlayerAgg.new({
      id: uuidv4(),
      name: 'Test Player',
      position: PositionVo.new(0, 0),
      direction: DirectionVo.new(2),
      heldItemId: null,
    });
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getPosition(): PositionVo {
    return this.position;
  }

  public getDirection(): DirectionVo {
    return this.direction;
  }

  public getHeldItemid(): string | null {
    return this.heldItemId;
  }
}
