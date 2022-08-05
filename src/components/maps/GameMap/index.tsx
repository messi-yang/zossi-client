import { useRef, useState, useCallback, useEffect } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import useDomRect from '@/hooks/useDomRect';
import useResolutionCalculator from '@/hooks/useResolutionCalculator';
import type { AreaEntity, UnitEntity, CoordinateEntity } from '@/entities';
import dataTestids from './dataTestids';
import UnitSquares from './subComponents/UnitSquares';
import type { Commands as UnitSquaresCommands } from './subComponents/UnitSquares';

const squareSize = 20;

const isOutsideMap = (
  mapWidth: number,
  mapHeight: number,
  coordinate: CoordinateEntity
): boolean => {
  if (coordinate.x < 0 || coordinate.x >= mapWidth) {
    return true;
  }
  if (coordinate.y < 0 || coordinate.y >= mapHeight) {
    return true;
  }
  return false;
};

type Props = {
  area: AreaEntity;
  units: UnitEntity[][];
  relativeCoordinates: CoordinateEntity[];
  onUnitsRevive: (coordinates: CoordinateEntity[]) => any;
  onAreaUpdate: (newArea: AreaEntity) => any;
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
    (coordinate: CoordinateEntity) => {
      const finalCoordinates = relativeCoordinates.map(
        (relativeCoordinate) => ({
          x: area.from.x + relativeCoordinate.x + coordinate.x,
          y: area.from.y + relativeCoordinate.y + coordinate.y,
        })
      );

      onUnitsRevive(finalCoordinates);
    },
    [relativeCoordinates, onUnitsRevive, area]
  );

  const unitSquaresRef = useRef<UnitSquaresCommands>(null);
  const [hoveredCoordinate, setHoveredCoordinate] =
    useState<CoordinateEntity | null>(null);
  const handleUnitSquareHover = useCallback((coordinate: CoordinateEntity) => {
    setHoveredCoordinate({ x: coordinate.x, y: coordinate.y });
  }, []);

  useEffect(() => {
    const setUnitsHighlighted = (highlighted: boolean) => {
      relativeCoordinates.forEach((relativeCoordinate) => {
        if (!unitSquaresRef.current || !hoveredCoordinate) {
          return;
        }
        const targetCoordinate = {
          x: relativeCoordinate.x + hoveredCoordinate.x,
          y: relativeCoordinate.y + hoveredCoordinate.y,
        };
        if (isOutsideMap(mapWidth, mapHeight, targetCoordinate)) {
          return;
        }
        unitSquaresRef.current.setUnitHighlighted(
          targetCoordinate,
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
