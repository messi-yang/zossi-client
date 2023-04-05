import { v4 as uuidv4 } from 'uuid';
import { PositionVo, DirectionVo, BoundVo } from '@/models/valueObjects';

export default class PlayerAgg {
  private id: string;

  private name: string;

  private position: PositionVo;

  private direction: DirectionVo;

  private visionBound: BoundVo;

  private heldItemId: string | null;

  constructor(params: {
    id: string;
    name: string;
    position: PositionVo;
    direction: DirectionVo;
    visionBound: BoundVo;
    heldItemId: string | null;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.position = params.position;
    this.direction = params.direction;
    this.visionBound = params.visionBound;
    this.heldItemId = params.heldItemId;
  }

  static new(params: {
    id: string;
    name: string;
    position: PositionVo;
    direction: DirectionVo;
    visionBound: BoundVo;
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
      visionBound: BoundVo.new(PositionVo.new(-10, -10), PositionVo.new(10, 10)),
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

  public getPositionText(): string {
    return `(${this.position.getX()}, ${this.position.getZ()})`;
  }

  public getDirection(): DirectionVo {
    return this.direction;
  }

  public getVisionBound(): BoundVo {
    return this.visionBound;
  }

  public getHeldItemid(): string | null {
    return this.heldItemId;
  }
}
