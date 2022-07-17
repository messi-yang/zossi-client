import { useState, useCallback, memo } from 'react';
import type { Unit, Coordinate } from './types';
import UnitBox from './UnitBox';
import UnitBoxeWrapper from './UnitBoxWrapper';
import Wrapper from './Wrapper';
import { getRelativeCoordinate, isCoordInRelatCoordsForRevival } from './utils';

type Props = {
  units: Unit[][];
  relatCoordsForRevival: Coordinate[];
  onUnitsRevive: (coordinates: Coordinate[]) => any;
};

const UnitBoxMemo = memo(UnitBox);

function GameOfLifeMap({ units, relatCoordsForRevival, onUnitsRevive }: Props) {
  const [hoveredCoordinate, setHoveredCoordinate] = useState<Coordinate | null>(
    null
  );
  const onUnitBoxClick = useCallback(
    (coordinate: Coordinate) => {
      const coordinatesToRevive = relatCoordsForRevival.map((relatCoord) =>
        getRelativeCoordinate(coordinate, relatCoord)
      );

      onUnitsRevive(coordinatesToRevive);
    },
    [relatCoordsForRevival]
  );
  const onUnitBoxHover = useCallback((coordinate: Coordinate) => {
    setHoveredCoordinate(coordinate);
  }, []);
  function isUnitToBeRevived(coordinate: Coordinate): boolean {
    if (!hoveredCoordinate || relatCoordsForRevival.length === 0) {
      return false;
    }

    return isCoordInRelatCoordsForRevival(
      coordinate,
      hoveredCoordinate,
      relatCoordsForRevival
    );
  }

  return (
    <Wrapper>
      <>
        {units.map((unitsRow, unitsRowIndex) => (
          <UnitBoxeWrapper
            key={unitsRow[0].coordinate.x}
            hasBorder={unitsRowIndex !== units.length - 1}
          >
            <>
              {unitsRow.map((unit, unitIndex) => (
                <UnitBoxMemo
                  key={`${unit.coordinate.x},${unit.coordinate.y}`}
                  unit={unit}
                  toBeRevived={isUnitToBeRevived(unit.coordinate)}
                  hasBorder={unitIndex !== unitsRow.length - 1}
                  onClick={onUnitBoxClick}
                  onHover={onUnitBoxHover}
                />
              ))}
            </>
          </UnitBoxeWrapper>
        ))}
      </>
    </Wrapper>
  );
}

export default GameOfLifeMap;
