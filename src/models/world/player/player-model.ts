import { DirectionVo } from '../common/direction-vo';
import { PlayerActionVo } from './player-action-vo';
import { PlayerActionNameEnum } from './player-action-name-enum';
import { DateVo } from '@/models/global/date-vo';
import { PrecisePositionVo } from '../common/precise-position-vo';
import { PositionVo } from '../common/position-vo';
import { generateUuidV4 } from '@/utils/uuid';
import { DimensionVo } from '../common/dimension-vo';

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

  static create(
    id: string,
    name: string,
    heldItemId: string | null,
    action: PlayerActionVo,
    precisePosition: PrecisePositionVo
  ): PlayerModel {
    return new PlayerModel(id, name, heldItemId, action, precisePosition);
  }

  static createMock(): PlayerModel {
    return PlayerModel.create(
      generateUuidV4(),
      'Test Player',
      null,
      PlayerActionVo.create(
        PlayerActionNameEnum.Stand,
        PrecisePositionVo.create(0, 0),
        DirectionVo.create(2),
        DateVo.now()
      ),
      PrecisePositionVo.create(0, 0)
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

  public getPosition(): PositionVo {
    return this.precisePosition.toPosition();
  }

  public getPrecisePosition(): PrecisePositionVo {
    return this.precisePosition;
  }

  public updatePrecisePosition(pos: PrecisePositionVo) {
    this.precisePosition = pos;
  }

  /**
   * Get the forward position of the player with distance, be aware that the return value is PositionVo not PrecisePositionVo
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

  /**
   * Get the desired position of the new unit based on new unit's dimension
   */
  public getDesiredNewUnitPosition(unitDimension: DimensionVo): PositionVo {
    const playerDirection = this.getDirection();
    const playerPosition = this.getPosition();
    const unitDimensionWidth = unitDimension.getWidth();
    const unitDimensionDepth = unitDimension.getDepth();

    if (playerDirection.isDown()) {
      return playerPosition.shift(-Math.floor((unitDimensionWidth - 1) / 2), 1);
    } else if (playerDirection.isRight()) {
      return playerPosition.shift(1, -Math.floor((unitDimensionWidth - 1) / 2));
    } else if (playerDirection.isUp()) {
      return playerPosition.shift(-Math.floor((unitDimensionWidth - 1) / 2), -unitDimensionDepth);
    } else {
      return playerPosition.shift(-unitDimensionDepth, -Math.floor((unitDimensionWidth - 1) / 2));
    }
  }
}
