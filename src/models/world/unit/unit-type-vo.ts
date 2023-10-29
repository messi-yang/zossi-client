import { UnitTypeEnum } from './unit-type-enum';

export class UnitTypeVo {
  constructor(private type: UnitTypeEnum) {}

  static new(type: UnitTypeEnum) {
    return new UnitTypeVo(type);
  }

  public isStatic() {
    return this.type === UnitTypeEnum.Static;
  }

  public isPortal() {
    return this.type === UnitTypeEnum.Portal;
  }
}
