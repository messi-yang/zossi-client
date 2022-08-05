import { useRef, useState, useCallback, useEffect } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import useDomRect from '@/hooks/useDomRect';
import useResolutionCalculator from '@/hooks/useResolutionCalculator';
import type { UnitEntity } from '@/entities';
import type { Area, Coordinate } from './types';
import dataTestids from './dataTestids';
import UnitSquares from './subComponents/UnitSquares';
import type { Commands as UnitSquaresCommands } from './subComponents/UnitSquares';

const squareSize = 20;

const isOutsideMap = (
  mapWidth: number,
  mapHeight: number,
  x: number,
  y: number
): boolean => {
  if (x < 0 || x >= mapWidth) {
    return true;
  }
  if (y < 0 || y >= mapHeight) {
    return true;
  }
  return false;
};

type Props = {
  area: Area;
  units: UnitEntity[][];
  relativeCoordinates: Coordinate[];
  onUnitsRevive: (coordinates: Coordinate[]) => any;
  onAreaUpdate: (newArea: Area) => any;
};

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
  const handleUnitSquareClick = useCallback(
    (x: number, y: number) => {
      const finalCoordinates = relativeCoordinates.map(
        (relativeCoordinate) => ({
          x: area.from.x + relativeCoordinate.x + x,
          y: area.from.y + relativeCoordinate.y + y,
        })
      );

      onUnitsRevive(finalCoordinates);
    },
    [relativeCoordinates, onUnitsRevive, area]
  );

  const unitSquaresRef = useRef<UnitSquaresCommands>(null);
  const [hoveredCoordinate, setHoveredCoordinate] = useState<Coordinate | null>(
    null
  );
  const handleUnitSquareHover = useCallback((x: number, y: number) => {
    setHoveredCoordinate({ x, y });
  }, []);

  useEffect(() => {
    const setUnitsHighlighted = (highlighted: boolean) => {
      relativeCoordinates.forEach((relativeCoordinate) => {
        if (!unitSquaresRef.current || !hoveredCoordinate) {
          return;
        }
        const targetX = relativeCoordinate.x + hoveredCoordinate.x;
        const targetY = relativeCoordinate.y + hoveredCoordinate.y;
        if (isOutsideMap(mapWidth, mapHeight, targetX, targetY)) {
          return;
        }
        unitSquaresRef.current.setUnitHighlighted(
          targetX,
          targetY,
          highlighted
        );
      });
    };
    setUnitsHighlighted(true);
    return () => {
      setUnitsHighlighted(false);
    };
  }, [
    mapWidth,
    mapHeight,
    hoveredCoordinate,
    relativeCoordinates,
    unitSquaresRef.current,
  ]);

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
      <UnitSquares
        ref={unitSquaresRef}
        width={mapWidth}
        height={mapHeight}
        units={units}
        onUnitSquareClick={handleUnitSquareClick}
        onUnitSquareHover={handleUnitSquareHover}
      />
    </section>
  );
}

export default GameMap;
export { dataTestids };
export type { Area, Coordinate };
