import { useRef, useState, useCallback, useEffect } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import useDomRect from '@/hooks/useDomRect';
import useResolutionCalculator from '@/hooks/useResolutionCalculator';
import type { Area, Unit, Coordinate } from './types';
import dataTestids from './dataTestids';
import UnitSquares from './subComponents/UnitSquares';

const squareSize = 20;

type Props = {
  area: Area;
  units: Unit[][];
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
        units={units}
        hoveredCoordinate={hoveredCoordinate}
        relativeCoordinates={relativeCoordinates}
        onUnitSquareClick={handleUnitSquareClick}
        onUnitSquareHover={handleUnitSquareHover}
      />
    </section>
  );
}

export default GameMap;
export { dataTestids };
export type { Area, Unit, Coordinate };
