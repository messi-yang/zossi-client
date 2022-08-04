import { useCallback, memo } from 'react';
import UnitSquare from '@/components/squares/UnitSquare';
import type { Area, Unit, Coordinate } from '../types';

const squareSize = 20;

type Props = {
  area: Area;
  units: Unit[][];
  hoveredCoordinate: Coordinate | null;
  relativeCoordinates: Coordinate[];
  onUnitSquareClick: (coordinateX: number, coordinateY: number) => void;
  onUnitSquareHover: (coordinateX: number, coordinateY: number) => void;
};

const UnitSquareMemo = memo(UnitSquare);

function UnitSquares({
  area,
  units,
  hoveredCoordinate,
  relativeCoordinates,
  onUnitSquareClick,
  onUnitSquareHover,
}: Props) {
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
    <>
      {units.map((unitsColumn, unitsColumnIndex) => (
        <section
          key={unitsColumn[0].coordinate.x}
          style={{
            flexBasis: squareSize,
            flexShrink: '0',
            display: 'flex',
            flexFlow: 'column',
          }}
        >
          {unitsColumn.map((unit, unitIndex) => {
            const coordinate = {
              x: area.from.x + unitsColumnIndex,
              y: area.from.y + unitIndex,
            };
            return (
              <section
                key={unit.coordinate.y}
                style={{ width: '100%', flexBasis: squareSize, flexShrink: 0 }}
              >
                <UnitSquareMemo
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
              </section>
            );
          })}
        </section>
      ))}
    </>
  );
}

export default UnitSquares;
