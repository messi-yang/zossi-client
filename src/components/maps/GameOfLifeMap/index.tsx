import { useState, useCallback, memo } from 'react';
import UnitSquare from '@/components/squares/UnitSquare';
import type { Area, Unit, Coordinate, UnitsPattern } from './types';
import UnitSquareColumn from './UnitSquareColumn';
import Wrapper from './Wrapper';

function isXInArea(x: number, area: Area) {
  return x >= area.from.x && x <= area.to.x;
}

function isYInArea(y: number, area: Area) {
  return y >= area.from.y && y <= area.to.y;
}

function adjustCoordinateAndUnitsPattern(
  originCoordinate: Coordinate,
  unitsPattern: UnitsPattern,
  area: Area
) {
  let adjustedUnitsPattern: UnitsPattern = unitsPattern.filter(
    (unitsRow, x) => {
      const isRowWithinArea = isXInArea(originCoordinate.x + x, area);
      return isRowWithinArea;
    }
  );

  adjustedUnitsPattern = adjustedUnitsPattern.map((unitsRow) => {
    const rowWithUnitsInArea = unitsRow.filter((unit, y) =>
      isYInArea(originCoordinate.y + y, area)
    );
    return rowWithUnitsInArea;
  });
  const adjustedCoordinate = {
    x: originCoordinate.x > 0 ? originCoordinate.x : 0,
    y: originCoordinate.y > 0 ? originCoordinate.y : 0,
  };

  return {
    adjustedCoordinate,
    adjustedUnitsPattern,
  };
}

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
      const originCoordinate = {
        x: coordinateX + unitsPatternOffset.x,
        y: coordinateY + unitsPatternOffset.y,
      };
      const { adjustedCoordinate, adjustedUnitsPattern } =
        adjustCoordinateAndUnitsPattern(originCoordinate, unitsPattern, area);
      onUnitsPatternDrop(adjustedCoordinate, adjustedUnitsPattern);
    },
    [unitsPattern, unitsPatternOffset, onUnitsPatternDrop, area]
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
