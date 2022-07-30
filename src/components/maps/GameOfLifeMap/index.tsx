import { useState, useCallback, memo } from 'react';
import UnitSquare from '@/components/squares/UnitSquare';
import type { Area, Unit, Coordinate } from './types';
import UnitSquareColumn from './UnitSquareColumn';
import Wrapper from './Wrapper';

function isCoordinateInArea(coordinate: Coordinate, area: Area): boolean {
  if (coordinate.x < area.from.x || coordinate.x > area.to.x) {
    return false;
  }
  if (coordinate.y < area.from.y || coordinate.y > area.to.y) {
    return false;
  }
  return true;
}

type Props = {
  area: Area;
  units: Unit[][];
  relativeCoordinates: Coordinate[];
  onUnitsRevive: (coordinates: Coordinate[]) => any;
};

const UnitSquareMemo = memo(UnitSquare);

function GameOfLifeMap({
  area,
  units,
  relativeCoordinates,
  onUnitsRevive,
}: Props) {
  const [hoveredCoordinate, setHoveredCoordinate] = useState<Coordinate | null>(
    null
  );
  const onUnitSquareClick = useCallback(
    (coordinateX: number, coordinateY: number) => {
      const finalCoordinates = relativeCoordinates
        .map(({ x, y }) => ({
          x: coordinateX + x,
          y: coordinateY + y,
        }))
        .filter((coordinate) => isCoordinateInArea(coordinate, area));

      onUnitsRevive(finalCoordinates);
    },
    [relativeCoordinates, onUnitsRevive, area]
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
      if (!hoveredCoordinate || relativeCoordinates.length === 0) {
        return false;
      }
      const relativeX = coordinate.x - hoveredCoordinate.x;
      const relativeY = coordinate.y - hoveredCoordinate.y;

      return (
        relativeCoordinates.findIndex(
          ({ x, y }) => x === relativeX && y === relativeY
        ) > -1
      );
    },
    [relativeCoordinates, hoveredCoordinate]
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
export type { Area, Unit, Coordinate };
