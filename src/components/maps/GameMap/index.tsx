import { useRef, useState, useCallback, useEffect } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import useDomRect from '@/hooks/useDomRect';
import useResolutionCalculator from '@/hooks/useResolutionCalculator';
import type { AreaEntity, UnitEntity, CoordinateEntity } from '@/entities';
import dataTestids from './dataTestids';
import UnitSquares from './subComponents/UnitSquares';
import type { Commands as UnitSquaresCommands } from './subComponents/UnitSquares';

const squareSize = 20;

type UnitIndexes = [colIdx: number, rowIdx: number];

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
    (colIdx: number, rowIdx: number) => {
      const finalCoordinates = relativeCoordinates.map(
        (relativeCoordinate) => ({
          x: area.from.x + colIdx + relativeCoordinate.x,
          y: area.from.y + rowIdx + relativeCoordinate.y,
        })
      );

      onUnitsRevive(finalCoordinates);
    },
    [relativeCoordinates, onUnitsRevive, area]
  );

  const unitSquaresCompRef = useRef<UnitSquaresCommands>(null);
  const [hoveredUnitIndexes, setHoveredUnitIndexes] =
    useState<UnitIndexes | null>(null);

  const handleUnitSquareHover = useCallback(
    (colIdx: number, rowIdx: number) => {
      setHoveredUnitIndexes([colIdx, rowIdx]);
    },
    []
  );

  useEffect(() => {
    const highlightRelativeCoordinates = (highlighted: boolean) => {
      relativeCoordinates.forEach((relativeCoordinate) => {
        if (!unitSquaresCompRef.current || !hoveredUnitIndexes) {
          return;
        }
        const colIdx = hoveredUnitIndexes[0] + relativeCoordinate.x;
        const rowIdx = hoveredUnitIndexes[1] + relativeCoordinate.y;
        unitSquaresCompRef.current.setUnitHighlighted(
          colIdx,
          rowIdx,
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
    hoveredUnitIndexes,
    relativeCoordinates,
    unitSquaresCompRef.current,
  ]);

  useEffect(() => {
    units.forEach((colOfUnits, colIdx) => {
      colOfUnits.forEach((unit, rowIdx) => {
        if (!unitSquaresCompRef.current) {
          return;
        }

        unitSquaresCompRef.current.setUnitAlive(colIdx, rowIdx, unit.alive);
      });
    });
  }, [mapWidth, mapHeight, units, unitSquaresCompRef.current]);

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
        ref={unitSquaresCompRef}
        width={mapWidth}
        height={mapHeight}
        onUnitSquareClick={handleUnitSquareClick}
        onUnitSquareHover={handleUnitSquareHover}
      />
    </section>
  );
}

export default GameMap;
export { dataTestids };
