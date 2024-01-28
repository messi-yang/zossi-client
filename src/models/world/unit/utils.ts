import { FenceUnitModel } from './fence-unit-model';
import { LinkUnitModel } from './link-unit-model';
import { PortalUnitModel } from './portal-unit-model';
import { StaticUnitModel } from './static-unit-model';
import { UnitModel } from './unit-model';
import { UnitTypeEnum } from './unit-type-enum';

/**
 * This function is mainly for making sure you handle every type of unit
 */
export const dispatchUnit = <T>(
  unit: UnitModel,
  mapper: {
    [UnitTypeEnum.Static]: (_unit: StaticUnitModel) => T;
    [UnitTypeEnum.Fence]: (_unit: FenceUnitModel) => T;
    [UnitTypeEnum.Portal]: (_unit: PortalUnitModel) => T;
    [UnitTypeEnum.Link]: (_unit: LinkUnitModel) => T;
  }
): T => {
  if (unit instanceof StaticUnitModel) {
    return mapper[UnitTypeEnum.Static](unit);
  } else if (unit instanceof FenceUnitModel) {
    return mapper[UnitTypeEnum.Fence](unit);
  } else if (unit instanceof PortalUnitModel) {
    return mapper[UnitTypeEnum.Portal](unit);
  } else if (unit instanceof LinkUnitModel) {
    return mapper[UnitTypeEnum.Link](unit);
  }
  throw new Error(`The unit type ${unit.getType()} is not handled here`);
};

/**
 * This function is mainly for making sure you handle every type in the enum
 */
export const dipatchUnitType = <T>(
  unitType: UnitTypeEnum,
  mapper: {
    [UnitTypeEnum.Static]: () => T;
    [UnitTypeEnum.Fence]: () => T;
    [UnitTypeEnum.Portal]: () => T;
    [UnitTypeEnum.Link]: () => T;
  }
): T => {
  if (unitType === UnitTypeEnum.Static) {
    return mapper[UnitTypeEnum.Static]();
  } else if (unitType === UnitTypeEnum.Fence) {
    return mapper[UnitTypeEnum.Fence]();
  } else if (unitType === UnitTypeEnum.Portal) {
    return mapper[UnitTypeEnum.Portal]();
  } else {
    return mapper[UnitTypeEnum.Link]();
  }
};
