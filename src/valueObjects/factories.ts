import CoordinateVO from '@/valueObjects/CoordinateVO';
import OffsetVO from '@/valueObjects/OffsetVO';
import UnitVO from '@/valueObjects/UnitVO';
import AreaVO from '@/valueObjects/AreaVO';
import MapSizeVO from '@/valueObjects/MapSizeVO';
import UnitMapVO from '@/valueObjects/UnitMapVO';
import UnitPatternVO from '@/valueObjects/UnitPatternVO';

export function generateAreaOffset(areaA: AreaVO | null, areaB: AreaVO | null): OffsetVO {
  if (!areaA || !areaB) {
    return new OffsetVO(0, 0);
  }
  return new OffsetVO(areaA.getFrom().getX() - areaB.getFrom().getX(), areaA.getFrom().getY() - areaB.getFrom().getY());
}

export function generateAreaWithCoordinateAndMapSize(coordinate: CoordinateVO, mapSize: MapSizeVO): AreaVO {
  return new AreaVO(
    coordinate,
    new CoordinateVO(coordinate.getX() + mapSize.getWidth(), coordinate.getY() + mapSize.getHeight())
  );
}

export function generateMapSizeWithUnitMap(unitMap: UnitMapVO): MapSizeVO {
  return new MapSizeVO(unitMap.getWidth(), unitMap.getHeight());
}

export function generateMapSizeWithArea(area: AreaVO): MapSizeVO {
  return new MapSizeVO(
    area.getTo().getX() - area.getFrom().getX() + 1,
    area.getTo().getY() - area.getFrom().getY() + 1
  );
}

export function generateEmptyUnitMapWithMapSize(mapSize: MapSizeVO): UnitMapVO {
  const unitMap = mapSize.map<UnitVO>(() => new UnitVO(false, 0));
  return new UnitMapVO(unitMap);
}

export function generateUnitMapWithUnitPattern(unitPattern: UnitPatternVO): UnitMapVO {
  const unitMap = unitPattern.map((_: number, __: number, alive: boolean) => new UnitVO(alive, 0));

  return new UnitMapVO(unitMap);
}

export default {};
