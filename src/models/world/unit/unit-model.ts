import { DirectionModel } from '../common/direction-model';
import { PositionModel } from '../common/position-model';
import { UnitTypeModel } from './unit-type-model';

export interface UnitModel {
  clone(): UnitModel;
  getType(): UnitTypeModel;
  getItemId(): string;
  getPosition(): PositionModel;
  getDirection(): DirectionModel;
  changeDirection(dir: DirectionModel): void;
}
