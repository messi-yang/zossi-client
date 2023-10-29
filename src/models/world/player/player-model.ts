import { v4 as uuidv4 } from 'uuid';
import { PositionModel } from '../common/position-model';
import { DirectionModel } from '../common/direction-model';
import { PlayerActionVo } from './player-action-vo';
import { PlayerActionEnum } from './player-action-enum';
import { DateModel } from '@/models/general/date-model';

export class PlayerModel {
  private position: PositionModel;

  constructor(
    private id: string,
    private name: string,
    private direction: DirectionModel,
    private heldItemId: string | null,
    private action: PlayerActionVo,
    private actionPosition: PositionModel,
    private actedAt: DateModel
  ) {
    this.position = actionPosition;
  }

  static new(
    id: string,
    name: string,
    direction: DirectionModel,
    heldItemId: string | null,
    action: PlayerActionVo,
    actionPosition: PositionModel,
    actedAt: DateModel
  ): PlayerModel {
    return new PlayerModel(id, name, direction, heldItemId, action, actionPosition, actedAt);
  }

  static mockup(): PlayerModel {
    return PlayerModel.new(
      uuidv4(),
      'Test Player',
      DirectionModel.new(2),
      null,
      PlayerActionVo.new(PlayerActionEnum.Stand),
      PositionModel.new(0, 0),
      DateModel.now()
    );
  }

  public clone(): PlayerModel {
    return new PlayerModel(
      this.id,
      this.name,
      this.direction,
      this.heldItemId,
      this.action,
      this.actionPosition,
      this.actedAt
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

  public getAction(): PlayerActionVo {
    return this.action;
  }

  public updateAction(action: PlayerActionVo) {
    this.action = action;
  }

  public getActionPosition(): PositionModel {
    return this.actionPosition;
  }

  public changeActionPosition(pos: PositionModel) {
    this.actionPosition = pos;
  }

  public getActedAt(): DateModel {
    return this.actedAt;
  }

  public updateActedAt(date: DateModel) {
    this.actedAt = date;
  }
}
