import { UnitModel } from './unit-model';
import { UnitTypeEnum } from './unit-type-enum';

/**
 * This function is mainly for making sure you handle every type of unit
 */
export const dispatchUnit = <T>(
  unit: UnitModel,
  mapper: {
    [UnitTypeEnum.Static]: (_unit: UnitModel) => T;
    [UnitTypeEnum.Fence]: (_unit: UnitModel) => T;
    [UnitTypeEnum.Portal]: (_unit: UnitModel) => T;
    [UnitTypeEnum.Link]: (_unit: UnitModel) => T;
    [UnitTypeEnum.Embed]: (_unit: UnitModel) => T;
    [UnitTypeEnum.Color]: (_unit: UnitModel) => T;
    [UnitTypeEnum.Sign]: (_unit: UnitModel) => T;
  }
): T => {
  if (unit.getType() === UnitTypeEnum.Static) {
    return mapper[UnitTypeEnum.Static](unit);
  } else if (unit.getType() === UnitTypeEnum.Fence) {
    return mapper[UnitTypeEnum.Fence](unit);
  } else if (unit.getType() === UnitTypeEnum.Portal) {
    return mapper[UnitTypeEnum.Portal](unit);
  } else if (unit.getType() === UnitTypeEnum.Link) {
    return mapper[UnitTypeEnum.Link](unit);
  } else if (unit.getType() === UnitTypeEnum.Embed) {
    return mapper[UnitTypeEnum.Embed](unit);
  } else if (unit.getType() === UnitTypeEnum.Color) {
    return mapper[UnitTypeEnum.Color](unit);
  } else if (unit.getType() === UnitTypeEnum.Sign) {
    return mapper[UnitTypeEnum.Sign](unit);
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
    [UnitTypeEnum.Embed]: () => T;
    [UnitTypeEnum.Color]: () => T;
    [UnitTypeEnum.Sign]: () => T;
  }
): T => {
  if (unitType === UnitTypeEnum.Static) {
    return mapper[UnitTypeEnum.Static]();
  } else if (unitType === UnitTypeEnum.Fence) {
    return mapper[UnitTypeEnum.Fence]();
  } else if (unitType === UnitTypeEnum.Portal) {
    return mapper[UnitTypeEnum.Portal]();
  } else if (unitType === UnitTypeEnum.Link) {
    return mapper[UnitTypeEnum.Link]();
  } else if (unitType === UnitTypeEnum.Embed) {
    return mapper[UnitTypeEnum.Embed]();
  } else if (unitType === UnitTypeEnum.Color) {
    return mapper[UnitTypeEnum.Color]();
  } else if (unitType === UnitTypeEnum.Sign) {
    return mapper[UnitTypeEnum.Sign]();
  }
  throw new Error(`The unit type ${unitType} is not handled here`);
};
