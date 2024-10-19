import { BoundVo } from '../common/bound-vo';
import { DimensionVo } from '../common/dimension-vo';
import { DirectionVo } from '../common/direction-vo';
import { PositionVo } from '../common/position-vo';
import { PrecisePositionVo } from '../common/precise-position-vo';
import { UnitTypeEnum } from './unit-type-enum';

export abstract class UnitModel {
  constructor(
    private id: string,
    private type: UnitTypeEnum,
    private itemId: string,
    private position: PositionVo,
    private direction: DirectionVo,
    private dimension: DimensionVo,
    private label: string | null
  ) {}

  abstract clone(): UnitModel;

  public getId(): string {
    return this.id;
  }

  public getType(): UnitTypeEnum {
    return this.type;
  }

  public getItemId(): string {
    return this.itemId;
  }

  /**
   * Returns the position at the unit's left-up corner
   */
  public getPosition(): PositionVo {
    return this.position;
  }

  public getCenterPrecisePosition(): PrecisePositionVo {
    return this.getOccupiedBound().getCenterPrecisePosition();
  }

  public getDirection(): DirectionVo {
    return this.direction;
  }

  public getDimension(): DimensionVo {
    return this.dimension;
  }

  public rotate() {
    if (this.dimension.isSymmetric()) {
      this.direction = this.direction.rotate();
    } else {
      this.direction = this.direction.rotate().rotate();
    }
  }

  public getLabel(): string | null {
    return this.label;
  }

  private getOccupiedBound(): BoundVo {
    const dimensionWidth = this.dimension.getWidth();
    const dimensionDepth = this.dimension.getDepth();

    let occupiedBoundTo = PositionVo.create(0, 0);

    if (this.direction.isDown()) {
      occupiedBoundTo = this.position.shift(dimensionWidth - 1, dimensionDepth - 1);
    } else if (this.direction.isRight()) {
      occupiedBoundTo = this.position.shift(dimensionDepth - 1, dimensionWidth - 1);
    } else if (this.direction.isUp()) {
      occupiedBoundTo = this.position.shift(dimensionWidth - 1, dimensionDepth - 1);
    } else {
      occupiedBoundTo = this.position.shift(dimensionDepth - 1, dimensionWidth - 1);
    }

    return BoundVo.create(this.position, occupiedBoundTo);
  }

  public getOccupiedPositions(): PositionVo[] {
    const positions: PositionVo[] = [];

    this.getOccupiedBound().iterate((pos) => {
      positions.push(pos);
    });

    return positions;
  }
}
