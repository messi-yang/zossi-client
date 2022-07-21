import { useState, useCallback, memo } from 'react';
import UnitSquare from '@/components/squares/UnitSquare';
import type { Area, Unit, Coordinate } from './types';
import UnitSquareColumn from './UnitSquareColumn';
import Wrapper from './Wrapper';
import { getRelativeCoordinate, isCoordInRelatCoordsForRevival } from './utils';

type Props = {
  area: Area;
  units: Unit[][];
  relatCoordsForRevival: Coordinate[];
  onUnitsRevive: (coordinates: Coordinate[]) => any;
};

const UnitSquareMemo = memo(UnitSquare);

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
        {units.map((unitsColumn, unitsColumnIndex) => (
          <UnitSquareColumn key={`${area.from.x + unitsColumnIndex}`}>
            <>
              {unitsColumn.map((unit, unitIndex) => {
                const coordinate = {
                  x: area.from.x + unitsColumnIndex,
                  y: area.from.y + unitIndex,
                };
                return (
                  <UnitSquareMemo
                    key={`${coordinate.x},${coordinate.y}`}
                    coordinateX={coordinate.x}
                    coordinateY={coordinate.y}
                    alive={unit.alive}
                    highlighted={isUnitToBeRevived(coordinate)}
                    hasTopBorder
                    hasRightBorder={unitsColumnIndex === units.length - 1}
                    hasBottomBorder={unitIndex === unitsColumn.length - 1}
                    hasLeftBorder
                    onClick={onUnitBoxClick}
                    onHover={onUnitBoxHover}
                  />
                );
              })}
            </>
          </UnitSquareColumn>
        ))}
      </>
    </Wrapper>
  );
}

export default GameOfLifeMap;
