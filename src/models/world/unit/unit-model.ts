import { DirectionModel } from '../common/direction-model';
import { PositionModel } from '../common/position-model';
import { UnitTypeEnum } from './unit-type-enum';

export interface UnitModel {
  clone(): UnitModel;
  getType(): UnitTypeEnum;
  getItemId(): string;
  getPosition(): PositionModel;
  getDirection(): DirectionModel;
  changeDirection(dir: DirectionModel): void;
}
