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
  let adjustedUnitsPattern: UnitsPattern = unitsPattern.filter((_, x) => {
    const isRowWithinArea = isXInArea(originCoordinate.x + x, area);
    return isRowWithinArea;
  });

  adjustedUnitsPattern = adjustedUnitsPattern.map((unitsRow) => {
    const rowWithUnitsInArea = unitsRow.filter((_, y) =>
      isYInArea(originCoordinate.y + y, area)
    );
    return rowWithUnitsInArea;
  });
  const adjustedCoordinate = {
    x: originCoordinate.x >= area.from.x ? originCoordinate.x : area.from.x,
    y: originCoordinate.y >= area.from.y ? originCoordinate.y : area.from.y,
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
  onUnitsPatternDrop: (coordinates: Coordinate[]) => any;
};

const UnitSquareMemo = memo(UnitSquare);

function GameOfLifeMap({
  area,
  units,
  unitsPattern,
  onUnitsPatternDrop,
}: Props) {
  const [hoveredCoordinate, setHoveredCoordinate] = useState<Coordinate | null>(
    null
  );
  const onUnitSquareClick = useCallback(
    (coordinateX: number, coordinateY: number) => {
      const originCoordinate = {
        x: coordinateX,
        y: coordinateY,
      };
      const { adjustedCoordinate, adjustedUnitsPattern } =
        adjustCoordinateAndUnitsPattern(originCoordinate, unitsPattern, area);
      const coordinates: Coordinate[] = [];
      adjustedUnitsPattern.forEach((row, x) => {
        row.forEach((truthy, y) => {
          if (truthy) {
            coordinates.push({
              x: adjustedCoordinate.x + x,
              y: adjustedCoordinate.y + y,
            });
          }
        });
      });
      onUnitsPatternDrop(coordinates);
    },
    [unitsPattern, onUnitsPatternDrop, area]
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
      const relativeX = coordinate.x - hoveredCoordinate.x;
      const relativeY = coordinate.y - hoveredCoordinate.y;

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
