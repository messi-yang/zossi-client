import { BoundVo } from './bound-vo';
import { DimensionVo } from './dimension-vo';
import { DirectionVo } from './direction-vo';
import { PositionVo } from './position-vo';

/**
 * Use self as the from position and generate a bound with the given dimension and direction.
 */
export function calculateExpectedUnitBound(position: PositionVo, dimension: DimensionVo, direction: DirectionVo): BoundVo {
  const dimensionWidth = dimension.getWidth();
  const dimensionDepth = dimension.getDepth();

  let occupiedBoundTo = PositionVo.create(0, 0);

  if (direction.isDown()) {
    occupiedBoundTo = position.shift(PositionVo.create(dimensionWidth - 1, dimensionDepth - 1));
  } else if (direction.isRight()) {
    occupiedBoundTo = position.shift(PositionVo.create(dimensionDepth - 1, dimensionWidth - 1));
  } else if (direction.isUp()) {
    occupiedBoundTo = position.shift(PositionVo.create(dimensionWidth - 1, dimensionDepth - 1));
  } else {
    occupiedBoundTo = position.shift(PositionVo.create(dimensionDepth - 1, dimensionWidth - 1));
  }

  return BoundVo.create(position, occupiedBoundTo);
}
