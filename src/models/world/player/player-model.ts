import { v4 as uuidv4 } from 'uuid';
import { PositionVo } from '../common/position-vo';
import { DirectionVo } from '../common/direction-vo';
import { PlayerActionVo } from './player-action-vo';
import { PlayerActionNameEnum } from './player-action-name-enum';
import { DateVo } from '@/models/general/date-vo';

export class PlayerModel {
  constructor(
    private id: string,
    private name: string,
    private heldItemId: string | null,
    private action: PlayerActionVo,
    private position: PositionVo
  ) {
    this.position = position;
  }

  static new(
    id: string,
    name: string,
    heldItemId: string | null,
    action: PlayerActionVo,
    position: PositionVo
  ): PlayerModel {
    return new PlayerModel(id, name, heldItemId, action, position);
  }

  static mockup(): PlayerModel {
    return PlayerModel.new(
      uuidv4(),
      'Test Player',
      null,
      PlayerActionVo.new(PlayerActionNameEnum.Stand, PositionVo.new(0, 0), DirectionVo.new(2), DateVo.now()),
      PositionVo.new(0, 0)
    );
  }

  public clone(): PlayerModel {
    return new PlayerModel(this.id, this.name, this.heldItemId, this.action, this.position);
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getDirection(): DirectionVo {
    return this.action.getDirection();
  }

  public getHeldItemId(): string | null {
    return this.heldItemId;
  }

  public changeHeldItemId(itemId: string): void {
    this.heldItemId = itemId;
  }

  public getFowardPos(): PositionVo {
    const direction = this.getDirection();
    if (direction.isUp()) {
      return this.position.shift(0, -1);
    } else if (direction.isRight()) {
      return this.position.shift(1, 0);
    } else if (direction.isDown()) {
      return this.position.shift(0, 1);
    } else if (direction.isLeft()) {
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

  public getPosition(): PositionVo {
    return this.position;
  }

  public updatePosition(pos: PositionVo) {
    this.position = pos;
  }
}
