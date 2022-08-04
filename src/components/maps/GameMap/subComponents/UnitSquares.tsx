import { useCallback, memo } from 'react';
import UnitSquare from '@/components/squares/UnitSquare';
import type { Unit, Coordinate } from '../types';

const squareSize = 20;

type Props = {
  units: Unit[][];
  hoveredCoordinate: Coordinate | null;
  relativeCoordinates: Coordinate[];
  onUnitSquareClick: (x: number, y: number) => void;
  onUnitSquareHover: (x: number, y: number) => void;
};

const UnitSquareMemo = memo(UnitSquare);

function UnitSquares({
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
      {units.map((columnOfUnits, x) => (
        <section
          key={columnOfUnits[0].coordinate.x}
          style={{
            flexBasis: squareSize,
            flexShrink: '0',
            display: 'flex',
            flexFlow: 'column',
          }}
        >
          {columnOfUnits.map((unit, y) => (
            <section
              key={unit.coordinate.y}
              style={{ width: '100%', flexBasis: squareSize, flexShrink: 0 }}
            >
              <UnitSquareMemo
                x={x}
                y={y}
                alive={unit.alive}
                highlighted={isUnitToBeHighlighted(unit.coordinate)}
                hasTopBorder
                hasRightBorder={x === units.length - 1}
                hasBottomBorder={y === columnOfUnits.length - 1}
                hasLeftBorder
                onClick={onUnitSquareClick}
                onHover={onUnitSquareHover}
              />
            </section>
          ))}
        </section>
      ))}
    </>
  );
}

export default UnitSquares;
