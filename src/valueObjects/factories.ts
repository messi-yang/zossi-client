import CoordinateValueObject from '@/valueObjects/CoordinateValueObject';
import OffsetValueObject from '@/valueObjects/OffsetValueObject';
import UnitValueObject from '@/valueObjects/UnitValueObject';
import AreaValueObject from '@/valueObjects/AreaValueObject';
import MapSizeValueObject from '@/valueObjects/MapSizeValueObject';
import UnitMapValueObject from '@/valueObjects/UnitMapValueObject';
import UnitPatternValueObject from '@/valueObjects/UnitPatternValueObject';

export function createArea(from: CoordinateValueObject, to: CoordinateValueObject): AreaValueObject {
  return new AreaValueObject(from, to);
}

export function createCoordinate(x: number, y: number): CoordinateValueObject {
  return new CoordinateValueObject(x, y);
}

export function createMapSize(width: number, height: number): MapSizeValueObject {
  return new MapSizeValueObject(width, height);
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

export function createUnit(alive: boolean, age: number): UnitValueObject {
  return new UnitValueObject(alive, age);
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

export function createAreaByCoordinateAndMapSize(
  coordinate: CoordinateValueObject,
  mapSize: MapSizeValueObject
): AreaValueObject {
  return createArea(coordinate, coordinate.shift(mapSize.getWidth(), mapSize.getHeight()));
}

export function createMapSizeByUnitMap(unitMap: UnitMapValueObject): MapSizeValueObject {
  return createMapSize(unitMap.getWidth(), unitMap.getHeight());
}

export function createMapSizeByArea(area: AreaValueObject): MapSizeValueObject {
  return createMapSize(
    area.getTo().getX() - area.getFrom().getX() + 1,
    area.getTo().getY() - area.getFrom().getY() + 1
  );
}

export function createUnitMapByMapSize(mapSize: MapSizeValueObject): UnitMapValueObject {
  const unitMap = mapSize.map<UnitValueObject>(() => new UnitValueObject(false, 0));
  return new UnitMapValueObject(unitMap);
}

export function createUnitMapByUnitPattern(unitPattern: UnitPatternValueObject): UnitMapValueObject {
  const unitMap = unitPattern.map((_: number, __: number, alive: boolean) => new UnitValueObject(alive, 0));

  return new UnitMapValueObject(unitMap);
}

export default {};
