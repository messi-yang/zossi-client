import UnitVo from './UnitVo';
import UnitMapVo from './UnitMapVo';
import AreaVo from './AreaVo';
import OffsetVo from './OffsetVo';
import CoordinateVo from './CoordinateVo';
import MapSizeVo from './MapSizeVo';

export function generateAreaOffset(areaA: AreaVo | null, areaB: AreaVo | null): OffsetVo {
  if (!areaA || !areaB) {
    return new OffsetVo(0, 0);
  }
  return new OffsetVo(areaA.getFrom().getX() - areaB.getFrom().getX(), areaA.getFrom().getY() - areaB.getFrom().getY());
}

export function generateAreaWithCoordinateAndMapSize(coordinate: CoordinateVo, mapSize: MapSizeVo): AreaVo {
  return new AreaVo(
    coordinate,
    new CoordinateVo(coordinate.getX() + mapSize.getWidth(), coordinate.getY() + mapSize.getHeight())
  );
}

export function generateMapSizeWithUnitMap(unitMap: UnitMapVo): MapSizeVo {
  return new MapSizeVo(unitMap.getWidth(), unitMap.getHeight());
}

export function generateMapSizeWithArea(area: AreaVo): MapSizeVo {
  return new MapSizeVo(
    area.getTo().getX() - area.getFrom().getX() + 1,
    area.getTo().getY() - area.getFrom().getY() + 1
  );
}

export function generateEmptyUnitMapWithMapSize(mapSize: MapSizeVo): UnitMapVo {
  const unitMap: UnitVo[][] = [];
  const width = mapSize.getWidth();
  const height = mapSize.getHeight();
  for (let x = 0; x < width; x += 1) {
    unitMap.push([]);
    for (let y = 0; y < height; y += 1) {
      unitMap[x].push(new UnitVo(false, 0));
    }
  }
  return new UnitMapVo(unitMap);
}

export default {};
