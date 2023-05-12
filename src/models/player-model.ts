import { v4 as uuidv4 } from 'uuid';
import { PositionModel } from './position-model';
import { DirectionModel } from './direction-model';
import { BoundModel } from './bound-model';

export class PlayerModel {
  private id: string;

  private name: string;

  private position: PositionModel;

  private direction: DirectionModel;

  private visionBound: BoundModel;

  private heldItemId: string | null;

  constructor(params: {
    id: string;
    name: string;
    position: PositionModel;
    direction: DirectionModel;
    visionBound: BoundModel;
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
    position: PositionModel;
    direction: DirectionModel;
    visionBound: BoundModel;
    heldItemId: string | null;
  }): PlayerModel {
    return new PlayerModel(params);
  }

  static newMockupPlayer(): PlayerModel {
    return PlayerModel.new({
      id: uuidv4(),
      name: 'Test Player',
      position: PositionModel.new(0, 0),
      direction: DirectionModel.new(2),
      visionBound: BoundModel.new(PositionModel.new(-10, -10), PositionModel.new(10, 10)),
      heldItemId: null,
    });
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
