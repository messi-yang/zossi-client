import CoordinateValueObject from '@/models/valueObjects/CoordinateValueObject';
import OffsetValueObject from '@/models/valueObjects/OffsetValueObject';
import UnitValueObject from '@/models/valueObjects/UnitValueObject';
import AreaValueObject from '@/models/valueObjects/AreaValueObject';
import DimensionValueObject from '@/models/valueObjects/DimensionValueObject';
import UnitBlockValueObject from '@/models/valueObjects/UnitBlockValueObject';
import UnitPatternValueObject from '@/models/valueObjects/UnitPatternValueObject';

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

export function createUnitBlock(unitMatrix: UnitValueObject[][]): UnitBlockValueObject {
  return new UnitBlockValueObject(unitMatrix);
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

export function createDimensionByUnitBlock(unitBlock: UnitBlockValueObject): DimensionValueObject {
  return createDimension(unitBlock.getWidth(), unitBlock.getHeight());
}

export function createDimensionByArea(area: AreaValueObject): DimensionValueObject {
  return createDimension(
    area.getTo().getX() - area.getFrom().getX() + 1,
    area.getTo().getY() - area.getFrom().getY() + 1
  );
}

export function createUnitBlockByDimension(dimension: DimensionValueObject): UnitBlockValueObject {
  const unitBlock = dimension.map<UnitValueObject>(() => new UnitValueObject(false));
  return new UnitBlockValueObject(unitBlock);
}

export function createUnitBlockByUnitPattern(unitPattern: UnitPatternValueObject): UnitBlockValueObject {
  const unitBlock = unitPattern.map((_: number, __: number, alive: boolean) => new UnitValueObject(alive));

  return new UnitBlockValueObject(unitBlock);
}

export default {};