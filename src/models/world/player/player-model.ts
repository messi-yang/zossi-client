import { v4 as uuidv4 } from 'uuid';
import { DirectionVo } from '../common/direction-vo';
import { PlayerActionVo } from './player-action-vo';
import { PlayerActionNameEnum } from './player-action-name-enum';
import { DateVo } from '@/models/general/date-vo';
import { PrecisePositionVo } from '../common/precise-position-vo';
import { PositionVo } from '../common/position-vo';

export class PlayerModel {
  constructor(
    private id: string,
    private name: string,
    private heldItemId: string | null,
    private action: PlayerActionVo,
    private precisePosition: PrecisePositionVo
  ) {
    this.precisePosition = precisePosition;
  }

  static new(
    id: string,
    name: string,
    heldItemId: string | null,
    action: PlayerActionVo,
    precisePosition: PrecisePositionVo
  ): PlayerModel {
    return new PlayerModel(id, name, heldItemId, action, precisePosition);
  }

  static mockup(): PlayerModel {
    return PlayerModel.new(
      uuidv4(),
      'Test Player',
      null,
      PlayerActionVo.new(PlayerActionNameEnum.Stand, PrecisePositionVo.new(0, 0), DirectionVo.new(2), DateVo.now()),
      PrecisePositionVo.new(0, 0)
    );
  }

  public clone(): PlayerModel {
    return new PlayerModel(this.id, this.name, this.heldItemId, this.action, this.precisePosition);
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

  public getAction(): PlayerActionVo {
    return this.action;
  }

  public updateAction(action: PlayerActionVo) {
    this.action = action;
  }

  public getPrecisePosition(): PrecisePositionVo {
    return this.precisePosition;
  }

  public updatePrecisePosition(pos: PrecisePositionVo) {
    this.precisePosition = pos;
  }

  /**
   * Get the forward position of the player with distance, be aware that the return value is PositionVo not PrecisePositionVo
   * @param distance adjust this distance in different cases
   * @returns
   */
  public getFowardPosition(distance: number): PositionVo {
    const direction = this.getDirection();
    if (direction.isUp()) {
      return this.precisePosition.shift(0, -distance).toPosition();
    } else if (direction.isRight()) {
      return this.precisePosition.shift(distance, 0).toPosition();
    } else if (direction.isDown()) {
      return this.precisePosition.shift(0, distance).toPosition();
    } else if (direction.isLeft()) {
      return this.precisePosition.shift(-distance, 0).toPosition();
    } else {
      return this.precisePosition.shift(0, distance).toPosition();
    }
  }
}
