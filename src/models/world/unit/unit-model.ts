import { DirectionVo } from '../common/direction-vo';
import { PositionVo } from '../common/position-vo';
import { UnitTypeEnum } from './unit-type-enum';

export interface UnitModel {
  clone(): UnitModel;
  getType(): UnitTypeEnum;
  getItemId(): string;
  getPosition(): PositionVo;
  getDirection(): DirectionVo;
  changeDirection(dir: DirectionVo): void;
}
