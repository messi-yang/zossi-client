import { v4 as uuidv4 } from 'uuid';
import { PositionModel } from './position-model';
import { DirectionModel } from './direction-model';
import { BoundModel } from './bound-model';

export class PlayerModel {
  constructor(
    private id: string,
    private name: string,
    private position: PositionModel,
    private direction: DirectionModel,
    private visionBound: BoundModel,
    private heldItemId: string | null
  ) {}

  static new(
    id: string,
    name: string,
    position: PositionModel,
    direction: DirectionModel,
    visionBound: BoundModel,
    heldItemId: string | null
  ): PlayerModel {
    return new PlayerModel(id, name, position, direction, visionBound, heldItemId);
  }

  static newMockupPlayer(): PlayerModel {
    return PlayerModel.new(
      uuidv4(),
      'Test Player',
      PositionModel.new(0, 0),
      DirectionModel.new(2),
      BoundModel.new(PositionModel.new(-10, -10), PositionModel.new(10, 10)),
      null
    );
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getPosition(): PositionModel {
    return this.position;
  }

  public getPositionText(): string {
    return `(${this.position.getX()}, ${this.position.getZ()})`;
  }

  public getDirection(): DirectionModel {
    return this.direction;
  }

  public getVisionBound(): BoundModel {
    return this.visionBound;
  }

  public getHeldItemid(): string | null {
    return this.heldItemId;
  }
}
