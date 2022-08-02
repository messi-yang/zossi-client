import { useRef, useState, useCallback, memo, useEffect } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import useDomRect from '@/hooks/useDomRect';
import useResolutionCalculator from '@/hooks/useResolutionCalculator';
import UnitSquare from '@/components/squares/UnitSquare';
import type { Area, Unit, Coordinate } from './types';
import dataTestids from './dataTestids';

const squareSize = 20;

type Props = {
  area: Area;
  units: Unit[][];
  relativeCoordinates: Coordinate[];
  onUnitsRevive: (coordinates: Coordinate[]) => any;
  onAreaUpdate: (newArea: Area) => any;
};

const UnitSquareMemo = memo(UnitSquare);

function GameMap({
  area,
  units,
  relativeCoordinates,
  onUnitsRevive,
  onAreaUpdate,
}: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const rootElemRect = useDomRect(rootRef);
  const [mapWidth, mapHeight] = useResolutionCalculator(
    { width: rootElemRect.width, height: rootElemRect.height },
    squareSize
  );
  const [hoveredCoordinate, setHoveredCoordinate] = useState<Coordinate | null>(
    null
  );
  const handleUnitSquareClick = useCallback(
    (coordinateX: number, coordinateY: number) => {
      const finalCoordinates = relativeCoordinates.map(({ x, y }) => ({
        x: coordinateX + x,
        y: coordinateY + y,
      }));

      onUnitsRevive(finalCoordinates);
    },
    [relativeCoordinates, onUnitsRevive, area]
  );
  const handleUnitSquareHover = useCallback(
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

  useEffect(() => {
    const newFrom = cloneDeep(area.from);
    const newTo = {
      x: newFrom.x + mapWidth - 1,
      y: newFrom.x + mapHeight - 1,
    };
    onAreaUpdate({
      from: newFrom,
      to: newTo,
    });
  }, [mapWidth, mapHeight]);

  return (
    <section
      ref={rootRef}
      data-testid={dataTestids.root}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        overflow: 'hidden',
      }}
    >
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
                  onClick={handleUnitSquareClick}
                  onHover={handleUnitSquareHover}
                />
              </section>
            );
          })}
        </section>
      ))}
    </section>
  );
}

export default GameMap;
export { dataTestids };
export type { Area, Unit, Coordinate };
