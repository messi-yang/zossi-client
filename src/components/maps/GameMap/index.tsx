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
  localCoordinate: CoordinateEntity
): boolean => {
  if (localCoordinate.x < 0 || localCoordinate.x >= mapWidth) {
    return true;
  }
  if (localCoordinate.y < 0 || localCoordinate.y >= mapHeight) {
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
    (localCoordinate: CoordinateEntity) => {
      const finalCoordinates = relativeCoordinates.map(
        (relativeCoordinate) => ({
          x: area.from.x + localCoordinate.x + relativeCoordinate.x,
          y: area.from.y + localCoordinate.y + relativeCoordinate.y,
        })
      );

      onUnitsRevive(finalCoordinates);
    },
    [relativeCoordinates, onUnitsRevive, area]
  );

  const unitSquaresRef = useRef<UnitSquaresCommands>(null);
  const [hoveredLocalCoordinate, setHoveredLocalCoordinate] =
    useState<CoordinateEntity | null>(null);

  const handleUnitSquareHover = useCallback(
    (localCoordinate: CoordinateEntity) => {
      setHoveredLocalCoordinate({ x: localCoordinate.x, y: localCoordinate.y });
    },
    []
  );

  useEffect(() => {
    const highlightRelativeCoordinates = (highlighted: boolean) => {
      relativeCoordinates.forEach((relativeCoordinate) => {
        if (!unitSquaresRef.current || !hoveredLocalCoordinate) {
          return;
        }
        const targetCoordinate = {
          x: hoveredLocalCoordinate.x + relativeCoordinate.x,
          y: hoveredLocalCoordinate.y + relativeCoordinate.y,
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
    highlightRelativeCoordinates(true);
    return () => {
      highlightRelativeCoordinates(false);
    };
  }, [
    mapWidth,
    mapHeight,
    hoveredLocalCoordinate,
    relativeCoordinates,
    unitSquaresRef.current,
  ]);

  const handleMapSizeUpdate = () => {
    const newFrom = cloneDeep(area.from);
    const newTo = {
      x: newFrom.x + mapWidth - 1,
      y: newFrom.x + mapHeight - 1,
    };
    onAreaUpdate({
      from: newFrom,
      to: newTo,
    });
  };
  useEffect(handleMapSizeUpdate, [mapWidth, mapHeight]);

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
