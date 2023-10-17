import { v4 as uuidv4 } from 'uuid';
import { PositionModel } from '../common/position-model';
import { DirectionModel } from '../common/direction-model';

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

  public clone(): PlayerModel {
    return new PlayerModel(this.id, this.name, this.position, this.direction, this.heldItemId);
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

  public changePosition(position: PositionModel): void {
    this.position = position;
  }

  public getDirection(): DirectionModel {
    return this.direction;
  }

  public changeDirection(direction: DirectionModel): void {
    this.direction = direction;
  }

  public getHeldItemId(): string | null {
    return this.heldItemId;
  }

  public changeHeldItemId(itemId: string): void {
    this.heldItemId = itemId;
  }

  public getFowardPos(): PositionModel {
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
