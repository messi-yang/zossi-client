import { DirectionVo } from '../common/direction-vo';
import { PositionVo } from '../common/position-vo';
import { UnitModel } from './unit-model';
import { UnitTypeEnum } from './unit-type-enum';
import { generateUuidV4 } from '@/utils/uuid';

export class FenceUnitModel implements UnitModel {
  constructor(private itemId: string, private position: PositionVo, private direction: DirectionVo) {}

  static new = (itemId: string, position: PositionVo, direction: DirectionVo): FenceUnitModel =>
    new FenceUnitModel(itemId, position, direction);

  static mockup(): FenceUnitModel {
    return new FenceUnitModel(generateUuidV4(), PositionVo.new(0, 0), DirectionVo.newDown());
  }

  public clone(): FenceUnitModel {
    return new FenceUnitModel(this.itemId, this.position, this.direction);
  }

  public getType(): UnitTypeEnum.Fence {
    return UnitTypeEnum.Fence;
  }

  public getItemId(): string {
    return this.itemId;
  }

  public getPosition(): PositionVo {
    return this.position;
  }

  public getDirection(): DirectionVo {
    return this.direction;
  }

  public changeDirection(direction: DirectionVo) {
    this.direction = direction;
  }
}
