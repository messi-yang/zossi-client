import CoordinateValueObject from '@/valueObjects/CoordinateValueObject';
import OffsetValueObject from '@/valueObjects/OffsetValueObject';
import UnitValueObject from '@/valueObjects/UnitValueObject';
import AreaValueObject from '@/valueObjects/AreaValueObject';
import DimensionValueObject from '@/valueObjects/DimensionValueObject';
import UnitMapValueObject from '@/valueObjects/UnitMapValueObject';
import UnitPatternValueObject from '@/valueObjects/UnitPatternValueObject';

export function createArea(from: CoordinateValueObject, to: CoordinateValueObject): AreaValueObject {
  return new AreaValueObject(from, to);
}

export function createCoordinate(x: number, y: number): CoordinateValueObject {
  return new CoordinateValueObject(x, y);
}

export function createDimension(width: number, height: number): DimensionValueObject {
  return new DimensionValueObject(width, height);
}

export function createOffset(x: number, y: number): OffsetValueObject {
  return new OffsetValueObject(x, y);
}

export function createUnitMap(unitMatrix: UnitValueObject[][]): UnitMapValueObject {
  return new UnitMapValueObject(unitMatrix);
}

export function createUnitPattern(pattern: boolean[][]): UnitPatternValueObject {
  return new UnitPatternValueObject(pattern);
}

export function createUnit(alive: boolean): UnitValueObject {
  return new UnitValueObject(alive);
}

export function createOffsetOfTwoAreas(
  areaA: AreaValueObject | null,
  areaB: AreaValueObject | null
): OffsetValueObject {
  if (!areaA || !areaB) {
    return new OffsetValueObject(0, 0);
  }
  return new OffsetValueObject(
    areaA.getFrom().getX() - areaB.getFrom().getX(),
    areaA.getFrom().getY() - areaB.getFrom().getY()
  );
}

export function createAreaByCoordinateAndDimension(
  coordinate: CoordinateValueObject,
  dimension: DimensionValueObject
): AreaValueObject {
  return createArea(coordinate, coordinate.shift(dimension.getWidth(), dimension.getHeight()));
}

export function createDimensionByUnitMap(unitMap: UnitMapValueObject): DimensionValueObject {
  return createDimension(unitMap.getWidth(), unitMap.getHeight());
}

export function createDimensionByArea(area: AreaValueObject): DimensionValueObject {
  return createDimension(
    area.getTo().getX() - area.getFrom().getX() + 1,
    area.getTo().getY() - area.getFrom().getY() + 1
  );
}

export function createUnitMapByDimension(dimension: DimensionValueObject): UnitMapValueObject {
  const unitMap = dimension.map<UnitValueObject>(() => new UnitValueObject(false));
  return new UnitMapValueObject(unitMap);
}

export function createUnitMapByUnitPattern(unitPattern: UnitPatternValueObject): UnitMapValueObject {
  const unitMap = unitPattern.map((_: number, __: number, alive: boolean) => new UnitValueObject(alive));

  return new UnitMapValueObject(unitMap);
}

export default {};
