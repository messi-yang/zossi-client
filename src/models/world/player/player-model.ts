import { v4 as uuidv4 } from 'uuid';
import { PositionVo } from '../common/position-vo';
import { DirectionVo } from '../common/direction-vo';
import { PlayerActionVo } from './player-action-vo';
import { PlayerActionEnum } from './player-action-enum';
import { DateVo } from '@/models/general/date-vo';

export class PlayerModel {
  private position: PositionVo;

  constructor(
    private id: string,
    private name: string,
    private direction: DirectionVo,
    private heldItemId: string | null,
    private action: PlayerActionVo,
    private actionPosition: PositionVo,
    private actedAt: DateVo
  ) {
    this.position = actionPosition;
  }

  static new(
    id: string,
    name: string,
    direction: DirectionVo,
    heldItemId: string | null,
    action: PlayerActionVo,
    actionPosition: PositionVo,
    actedAt: DateVo
  ): PlayerModel {
    return new PlayerModel(id, name, direction, heldItemId, action, actionPosition, actedAt);
  }

  static mockup(): PlayerModel {
    return PlayerModel.new(
      uuidv4(),
      'Test Player',
      DirectionVo.new(2),
      null,
      PlayerActionVo.new(PlayerActionEnum.Stand),
      PositionVo.new(0, 0),
      DateVo.now()
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

  public getPosition(): PositionVo {
    return this.position;
  }

  public changePosition(position: PositionVo): void {
    this.position = position;
  }

  public getDirection(): DirectionVo {
    return this.direction;
  }

  public changeDirection(direction: DirectionVo): void {
    this.direction = direction;
  }

  public getHeldItemId(): string | null {
    return this.heldItemId;
  }

  public changeHeldItemId(itemId: string): void {
    this.heldItemId = itemId;
  }

  public getFowardPos(): PositionVo {
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

  public getActionPosition(): PositionVo {
    return this.actionPosition;
  }

  public changeActionPosition(pos: PositionVo) {
    this.actionPosition = pos;
  }

  public getActedAt(): DateVo {
    return this.actedAt;
  }

  public updateActedAt(date: DateVo) {
    this.actedAt = date;
  }
}
