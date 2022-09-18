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

export default {};
