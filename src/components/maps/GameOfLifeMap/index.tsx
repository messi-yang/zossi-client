import { useState, useCallback, memo } from 'react';
import type { Area, Unit, Coordinate } from './types';
import UnitBox from './UnitBox';
import UnitBoxeWrapper from './UnitBoxWrapper';
import Wrapper from './Wrapper';
import { getRelativeCoordinate, isCoordInRelatCoordsForRevival } from './utils';

type Props = {
  area: Area;
  units: Unit[][];
  relatCoordsForRevival: Coordinate[];
  onUnitsRevive: (coordinates: Coordinate[]) => any;
};

const UnitBoxMemo = memo(UnitBox);

function GameOfLifeMap({
  area,
  units,
  relatCoordsForRevival,
  onUnitsRevive,
}: Props) {
  const [hoveredCoordinate, setHoveredCoordinate] = useState<Coordinate | null>(
    null
  );
  const onUnitBoxClick = useCallback(
    (coordinateX: number, coordinateY: number) => {
      const coordinate = { x: coordinateX, y: coordinateY };
      const coordinatesToRevive = relatCoordsForRevival.map((relatCoord) =>
        getRelativeCoordinate(coordinate, relatCoord)
      );

      onUnitsRevive(coordinatesToRevive);
    },
    [relatCoordsForRevival]
  );
  const onUnitBoxHover = useCallback(
    (coordinateX: number, coordinateY: number) => {
      const coordinate = { x: coordinateX, y: coordinateY };
      setHoveredCoordinate(coordinate);
    },
    []
  );
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
            key={`${area.from.x + unitsRowIndex}`}
            hasBorder={unitsRowIndex !== units.length - 1}
          >
            <>
              {unitsRow.map((unit, unitIndex) => {
                const coordinate = {
                  x: area.from.x + unitsRowIndex,
                  y: area.from.y + unitIndex,
                };
                return (
                  <UnitBoxMemo
                    key={`${coordinate.x},${coordinate.y}`}
                    coordinateX={coordinate.x}
                    coordinateY={coordinate.y}
                    alive={unit.alive}
                    toBeRevived={isUnitToBeRevived(coordinate)}
                    hasBorder={unitIndex !== unitsRow.length - 1}
                    onClick={onUnitBoxClick}
                    onHover={onUnitBoxHover}
                  />
                );
              })}
            </>
          </UnitBoxeWrapper>
        ))}
      </>
    </Wrapper>
  );
}

export default GameOfLifeMap;
