import CoordinateVo from '@/models/valueObjects/CoordinateVo';
import OffsetVo from '@/models/valueObjects/OffsetVo';
import UnitVo from '@/models/valueObjects/UnitVo';
import AreaVo from '@/models/valueObjects/AreaVo';
import DimensionVo from '@/models/valueObjects/DimensionVo';
import UnitBlockVo from '@/models/valueObjects/UnitBlockVo';
import UnitPatternVo from '@/models/valueObjects/UnitPatternVo';

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

export function createUnitPattern(pattern: boolean[][]): UnitPatternVo {
  return new UnitPatternVo(pattern);
}

export function createUnit(alive: boolean): UnitVo {
  return new UnitVo(alive);
}

export function createOffsetOfTwoAreas(areaA: AreaVo | null, areaB: AreaVo | null): OffsetVo {
  if (!areaA || !areaB) {
    return new OffsetVo(0, 0);
  }
  return new OffsetVo(areaA.getFrom().getX() - areaB.getFrom().getX(), areaA.getFrom().getY() - areaB.getFrom().getY());
}

export function createAreaByCoordinateAndDimension(coordinate: CoordinateVo, dimension: DimensionVo): AreaVo {
  return createArea(coordinate, coordinate.shift(dimension.getWidth(), dimension.getHeight()));
}

export function createDimensionByUnitBlock(unitBlock: UnitBlockVo): DimensionVo {
  return createDimension(unitBlock.getWidth(), unitBlock.getHeight());
}

export function createDimensionByArea(area: AreaVo): DimensionVo {
  return createDimension(
    area.getTo().getX() - area.getFrom().getX() + 1,
    area.getTo().getY() - area.getFrom().getY() + 1
  );
}

export function createUnitBlockByDimension(dimension: DimensionVo): UnitBlockVo {
  const unitBlock = dimension.map<UnitVo>(() => new UnitVo(false));
  return new UnitBlockVo(unitBlock);
}

export function createUnitBlockByUnitPattern(unitPattern: UnitPatternVo): UnitBlockVo {
  const unitBlock = unitPattern.map((_: number, __: number, alive: boolean) => new UnitVo(alive));

  return new UnitBlockVo(unitBlock);
}

export default {};
