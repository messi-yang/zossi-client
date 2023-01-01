import CoordinateVo from '@/models/valueObjects/CoordinateVo';
import OffsetVo from '@/models/valueObjects/OffsetVo';
import UnitVo from '@/models/valueObjects/UnitVo';
import AreaVo from '@/models/valueObjects/AreaVo';
import DimensionVo from '@/models/valueObjects/DimensionVo';
import UnitBlockVo from '@/models/valueObjects/UnitBlockVo';

export function createArea(from: CoordinateVo, to: CoordinateVo): AreaVo {
  return new AreaVo(from, to);
}

export function createCoordinate(x: number, y: number): CoordinateVo {
  return new CoordinateVo(x, y);
}

export function createDimension(width: number, height: number): DimensionVo {
  return new DimensionVo(width, height);
}

export function createOffset(x: number, y: number): OffsetVo {
  return new OffsetVo(x, y);
}

export function createUnitBlock(unitMatrix: UnitVo[][]): UnitBlockVo {
  return new UnitBlockVo(unitMatrix);
}

export function createUnit(itemId: string | null): UnitVo {
  return new UnitVo(itemId);
}

export function createOffsetOfTwoAreas(areaA: AreaVo | null, areaB: AreaVo | null): OffsetVo {
  if (!areaA || !areaB) {
    return new OffsetVo(0, 0);
  }
  return new OffsetVo(areaA.getFrom().getX() - areaB.getFrom().getX(), areaA.getFrom().getY() - areaB.getFrom().getY());
}

export function createAreaByCoordinateAndDimension(coordinate: CoordinateVo, dimension: DimensionVo): AreaVo {
  return new AreaVo(coordinate, coordinate.shift(dimension.getWidth() - 1, dimension.getHeight() - 1));
}

export function calculateDimensionByResolutionAndUnitSideLength(
  resolution: { width: number; height: number },
  unitSideLength: number
): DimensionVo {
  const width = Math.floor(resolution.width / unitSideLength) || 1;
  const height = Math.floor(resolution.height / unitSideLength) || 1;
  return new DimensionVo(width, height);
}

export function createDimensionByUnitBlock(unitBlock: UnitBlockVo): DimensionVo {
  return new DimensionVo(unitBlock.getWidth(), unitBlock.getHeight());
}

export function createDimensionByArea(area: AreaVo): DimensionVo {
  return new DimensionVo(
    area.getTo().getX() - area.getFrom().getX() + 1,
    area.getTo().getY() - area.getFrom().getY() + 1
  );
}

export function createUnitBlockByDimension(dimension: DimensionVo): UnitBlockVo {
  const unitBlock = dimension.map<UnitVo>(() => new UnitVo(null));
  return new UnitBlockVo(unitBlock);
}

export default {};
