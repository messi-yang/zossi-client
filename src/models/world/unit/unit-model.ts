import { DirectionVo } from '../common/direction-vo';
import { PositionVo } from '../common/position-vo';
import { UnitTypeVo } from './unit-type-vo';

export interface UnitModel {
  clone(): UnitModel;
  getType(): UnitTypeVo;
  getItemId(): string;
  getPosition(): PositionVo;
  getDirection(): DirectionVo;
  changeDirection(dir: DirectionVo): void;
}
