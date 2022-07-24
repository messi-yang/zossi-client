import { useState, useCallback, memo } from 'react';
import UnitSquare from '@/components/squares/UnitSquare';
import { traverseMatrix } from '@/utils/common';
import type { Area, Unit, Coordinate, Pattern } from './types';
import UnitSquareColumn from './UnitSquareColumn';
import Wrapper from './Wrapper';

type Props = {
  area: Area;
  units: Unit[][];
  pattern: Pattern;
  patternOffset?: { x: number; y: number };
  onPatternDrop: (coordinates: Coordinate[]) => any;
};

const UnitSquareMemo = memo(UnitSquare);

function GameOfLifeMap({
  area,
  units,
  pattern,
  patternOffset = { x: 0, y: 0 },
  onPatternDrop,
}: Props) {
  const [hoveredCoordinate, setHoveredCoordinate] = useState<Coordinate | null>(
    null
  );
  const onUnitSquareClick = useCallback(
    (coordinateX: number, coordinateY: number) => {
      const coordinates: Coordinate[] = [];
      traverseMatrix<boolean>(pattern, (x, y, unit) => {
        if (unit) {
          coordinates.push({
            x: coordinateX + x + patternOffset.x,
            y: coordinateY + y + patternOffset.y,
          });
        }
      });

      onPatternDrop(coordinates);
    },
    [pattern]
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
      if (!hoveredCoordinate || pattern.length === 0) {
        return false;
      }
      const relativeX = coordinate.x - hoveredCoordinate.x - patternOffset.x;
      const relativeY = coordinate.y - hoveredCoordinate.y - patternOffset.y;

      const isRelativeCoordinateInPatternPresentAndTruthy =
        pattern?.[relativeX]?.[relativeY] || false;
      return isRelativeCoordinateInPatternPresentAndTruthy;
    },
    [pattern, hoveredCoordinate]
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
