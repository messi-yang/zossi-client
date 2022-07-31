import { useRef, useState, useCallback, memo, useEffect } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import useDomRect from '@/hooks/useDomRect';
import useResolutionCalculator from '@/hooks/useResolutionCalculator';
import UnitSquare from '@/components/squares/UnitSquare';
import type { Area, Unit, Coordinate } from './types';
import dataTestids from './dataTestids';

function isCoordinateInArea(coordinate: Coordinate, area: Area): boolean {
  if (coordinate.x < area.from.x || coordinate.x > area.to.x) {
    return false;
  }
  if (coordinate.y < area.from.y || coordinate.y > area.to.y) {
    return false;
  }
  return true;
}

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
      data-testid={dataTestids.wrapper}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        overflow: 'hidden',
      }}
    >
      {units.map((unitsColumn, unitsColumnIndex) => (
        <section
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
                key={`${coordinate.x},${coordinate.y}`}
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
    </section>
  );
}

export default GameMap;
export type { Area, Unit, Coordinate };
