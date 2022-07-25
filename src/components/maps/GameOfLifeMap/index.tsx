import { useState, useCallback, memo } from 'react';
import UnitSquare from '@/components/squares/UnitSquare';
import type { Area, Unit, Coordinate, UnitsPattern } from './types';
import UnitSquareColumn from './UnitSquareColumn';
import Wrapper from './Wrapper';

type Props = {
  area: Area;
  units: Unit[][];
  unitsPattern: UnitsPattern;
  unitsPatternOffset: { x: number; y: number };
  onUnitsPatternDrop: (coordinate: Coordinate, pattern: UnitsPattern) => any;
};

const UnitSquareMemo = memo(UnitSquare);

function GameOfLifeMap({
  area,
  units,
  unitsPattern,
  unitsPatternOffset,
  onUnitsPatternDrop,
}: Props) {
  const [hoveredCoordinate, setHoveredCoordinate] = useState<Coordinate | null>(
    null
  );
  const onUnitSquareClick = useCallback(
    (coordinateX: number, coordinateY: number) => {
      onUnitsPatternDrop(
        {
          x: coordinateX + unitsPatternOffset.x,
          y: coordinateY + unitsPatternOffset.y,
        },
        unitsPattern
      );
    },
    [unitsPattern, unitsPatternOffset, onUnitsPatternDrop]
  );
  const onUnitSquareHover = useCallback(
    (coordinateX: number, coordinateY: number) => {
      const coordinate = { x: coordinateX, y: coordinateY };
      setHoveredCoordinate(coordinate);
    },
    []
  );
  const isUnitToBeHighlighted = useCallback(
    (coordinate: Coordinate): boolean => {
      if (!hoveredCoordinate || unitsPattern.length === 0) {
        return false;
      }
      const relativeX =
        coordinate.x - hoveredCoordinate.x - unitsPatternOffset.x;
      const relativeY =
        coordinate.y - hoveredCoordinate.y - unitsPatternOffset.y;

      const isRelativeCoordinateInPatternPresentAndTruthy =
        unitsPattern?.[relativeX]?.[relativeY] || false;
      return isRelativeCoordinateInPatternPresentAndTruthy;
    },
    [unitsPattern, hoveredCoordinate]
  );

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
                    highlighted={isUnitToBeHighlighted(coordinate)}
                    hasTopBorder
                    hasRightBorder={unitsColumnIndex === units.length - 1}
                    hasBottomBorder={unitIndex === unitsColumn.length - 1}
                    hasLeftBorder
                    onClick={onUnitSquareClick}
                    onHover={onUnitSquareHover}
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
