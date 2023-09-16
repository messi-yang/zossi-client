import { v4 as uuidv4 } from 'uuid';
import { PositionModel } from './position-model';
import { DirectionModel } from './direction-model';

export class PlayerModel {
  constructor(
    private id: string,
    private name: string,
    private position: PositionModel,
    private direction: DirectionModel,
    private heldItemId: string | null
  ) {}

  static new(
    id: string,
    name: string,
    position: PositionModel,
    direction: DirectionModel,
    heldItemId: string | null
  ): PlayerModel {
    return new PlayerModel(id, name, position, direction, heldItemId);
  }

  static mockup(): PlayerModel {
    return PlayerModel.new(uuidv4(), 'Test Player', PositionModel.new(0, 0), DirectionModel.new(2), null);
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

  public getHeldItemid(): string | null {
    return this.heldItemId;
  }

  public getPositionOneStepFoward(): PositionModel {
    if (this.direction.isUp()) {
      return this.position.shift(0, -1);
    } else if (this.direction.isRight()) {
      return this.position.shift(1, 0);
    } else if (this.direction.isDown()) {
      return this.position.shift(0, 1);
    } else if (this.direction.isLeft()) {
      return this.position.shift(-1, 0);
    } else {
      return this.position.shift(0, 1);
    }
  }
}
