import { DirectionVo } from '../common/direction-vo';
import { PositionVo } from '../common/position-vo';
import { UnitModel } from './unit-model';
import { UnitTypeEnum } from './unit-type-enum';
import { UnitTypeVo } from './unit-type-vo';

export class StaticUnitModel implements UnitModel {
  private type: UnitTypeVo = UnitTypeVo.new(UnitTypeEnum.Static);

  constructor(private itemId: string, private position: PositionVo, private direction: DirectionVo) {}

  static new = (itemId: string, position: PositionVo, direction: DirectionVo): StaticUnitModel =>
    new StaticUnitModel(itemId, position, direction);

  static mockup(): StaticUnitModel {
    return new StaticUnitModel('414b5703-91d1-42fc-a007-36dd8f25e329', PositionVo.new(0, 0), DirectionVo.newDown());
  }

  public clone(): StaticUnitModel {
    return new StaticUnitModel(this.itemId, this.position, this.direction);
  }

  public getType(): UnitTypeVo {
    return this.type;
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
