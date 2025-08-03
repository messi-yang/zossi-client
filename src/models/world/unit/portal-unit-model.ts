import { DimensionVo } from '../common/dimension-vo';
import { DirectionVo } from '../common/direction-vo';
import { PositionVo } from '../common/position-vo';
import { UnitTypeEnum } from './unit-type-enum';
import { BaseUnitModel } from './base-unit-model';

export class PortalUnitModel extends BaseUnitModel {
  constructor(
    id: string,
    type: UnitTypeEnum,
    itemId: string,
    position: PositionVo,
    direction: DirectionVo,
    dimension: DimensionVo,
    protected label: string,
    protected targetUnitId: string
  ) {
    super(id, type, itemId, position, direction, dimension, label, null);
  }

  static create = (
    id: string,
    type: UnitTypeEnum,
    itemId: string,
    position: PositionVo,
    direction: DirectionVo,
    dimension: DimensionVo,
    label: string,
    targetUnitId: string
  ): PortalUnitModel => new PortalUnitModel(id, type, itemId, position, direction, dimension, label, targetUnitId);

  public clone(): PortalUnitModel {
    return new PortalUnitModel(
      this.id,
      this.type,
      this.itemId,
      this.position,
      this.direction,
      this.dimension,
      this.label,
      this.targetUnitId
    );
  }

  public getLabel(): string {
    return this.label;
  }

  public getColor(): null {
    return null;
  }

  public getTargetUnitId(): string {
    return this.targetUnitId;
  }
}
