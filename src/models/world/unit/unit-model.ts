import { DirectionVo } from '../common/direction-vo';
import { PositionVo } from '../common/position-vo';
import { UnitTypeEnum } from './unit-type-enum';

export interface UnitModel {
  clone(): UnitModel;
  getId(): string;
  getType(): UnitTypeEnum;
  getItemId(): string;
  getPosition(): PositionVo;
  getDirection(): DirectionVo;
  getLabel(): string | null;
  changeDirection(dir: DirectionVo): void;
}

export abstract class BaseUnitModel implements UnitModel {
  constructor(
    private id: string,
    private itemId: string,
    private position: PositionVo,
    private direction: DirectionVo,
    private label: string | null
  ) {}

  abstract clone(): UnitModel;

  public getId(): string {
    return this.id;
  }
  abstract getType(): UnitTypeEnum;

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

  public getLabel(): string | null {
    return this.label;
  }
}
