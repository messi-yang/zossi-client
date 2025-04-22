import { BoundVo } from '../common/bound-vo';
import { ColorVo } from '../common/color-vo';
import { DimensionVo } from '../common/dimension-vo';
import { DirectionVo } from '../common/direction-vo';
import { PositionVo } from '../common/position-vo';
import { PrecisePositionVo } from '../common/precise-position-vo';
import { calculateExpectedUnitBound } from '../common/utils';
import { UnitTypeEnum } from './unit-type-enum';

export abstract class UnitModel {
  constructor(
    protected id: string,
    protected type: UnitTypeEnum,
    protected itemId: string,
    protected position: PositionVo,
    protected direction: DirectionVo,
    protected dimension: DimensionVo,
    protected label: string | null,
    protected color: ColorVo | null
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

  public move(position: PositionVo) {
    this.position = position;
  }

  public getLabel(): string | null {
    return this.label;
  }

  public getColor(): ColorVo | null {
    return this.color;
  }

  public getOccupiedBound(): BoundVo {
    return calculateExpectedUnitBound(this.position, this.dimension, this.direction);
  }

  public getOccupiedPositions(): PositionVo[] {
    const positions: PositionVo[] = [];

    this.getOccupiedBound().iterate((pos) => {
      positions.push(pos);
    });

    return positions;
  }
}
