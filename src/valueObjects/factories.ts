import CoordinateValueObject from '@/valueObjects/CoordinateValueObject';
import OffsetValueObject from '@/valueObjects/OffsetValueObject';
import UnitValueObject from '@/valueObjects/UnitValueObject';
import AreaValueObject from '@/valueObjects/AreaValueObject';
import MapSizeValueObject from '@/valueObjects/MapSizeValueObject';
import UnitMapValueObject from '@/valueObjects/UnitMapValueObject';
import UnitPatternValueObject from '@/valueObjects/UnitPatternValueObject';

export function generateAreaOffset(areaA: AreaValueObject | null, areaB: AreaValueObject | null): OffsetValueObject {
  if (!areaA || !areaB) {
    return new OffsetValueObject(0, 0);
  }
  return new OffsetValueObject(
    areaA.getFrom().getX() - areaB.getFrom().getX(),
    areaA.getFrom().getY() - areaB.getFrom().getY()
  );
}

export function generateAreaWithCoordinateAndMapSize(
  coordinate: CoordinateValueObject,
  mapSize: MapSizeValueObject
): AreaValueObject {
  return new AreaValueObject(
    coordinate,
    new CoordinateValueObject(coordinate.getX() + mapSize.getWidth(), coordinate.getY() + mapSize.getHeight())
  );
}

export function generateMapSizeWithUnitMap(unitMap: UnitMapValueObject): MapSizeValueObject {
  return new MapSizeValueObject(unitMap.getWidth(), unitMap.getHeight());
}

export function generateMapSizeWithArea(area: AreaValueObject): MapSizeValueObject {
  return new MapSizeValueObject(
    area.getTo().getX() - area.getFrom().getX() + 1,
    area.getTo().getY() - area.getFrom().getY() + 1
  );
}

export function generateEmptyUnitMapWithMapSize(mapSize: MapSizeValueObject): UnitMapValueObject {
  const unitMap = mapSize.map<UnitValueObject>(() => new UnitValueObject(false, 0));
  return new UnitMapValueObject(unitMap);
}

export function generateUnitMapWithUnitPattern(unitPattern: UnitPatternValueObject): UnitMapValueObject {
  const unitMap = unitPattern.map((_: number, __: number, alive: boolean) => new UnitValueObject(alive, 0));

  return new UnitMapValueObject(unitMap);
}

export default {};
