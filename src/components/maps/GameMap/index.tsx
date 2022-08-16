import { useRef, useState, useCallback, useEffect } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { gameBackgroundColor } from '@/styles/colors';
import useDomRect from '@/hooks/useDomRect';
import useResolutionCalculator from '@/hooks/useResolutionCalculator';
import type { AreaEntity, UnitEntity, CoordinateEntity } from '@/entities';
import dataTestids from './dataTestids';
import UnitSquares from './subComponents/UnitSquares';
import type { Commands as UnitSquaresCommands } from './subComponents/UnitSquares';

type Props = {
  area: AreaEntity;
  units: UnitEntity[][];
  relativeCoordinates: CoordinateEntity[];
  onUnitsRevive: (coordinates: CoordinateEntity[]) => any;
  onAreaUpdate: (newArea: AreaEntity) => any;
};

function GameMap({ area, units, relativeCoordinates, onUnitsRevive, onAreaUpdate }: Props) {
  const [squareSize] = useState<number>(25);
  const rootRef = useRef<HTMLElement>(null);
  const rootElemRect = useDomRect(rootRef);
  const [areaWidth, areaHeight] = useResolutionCalculator(
    { width: rootElemRect.width, height: rootElemRect.height },
    squareSize
  );
  const [hoveredIndexes, setHoveredIndexes] = useState<[colIdx: number, rowIdx: number] | null>(null);

  const handleUnitSquareClick = useCallback(
    (colIdx: number, rowIdx: number) => {
      const finalCoordinates = relativeCoordinates.map((relativeCoordinate) => ({
        x: area.from.x + colIdx + relativeCoordinate.x,
        y: area.from.y + rowIdx + relativeCoordinate.y,
      }));

      onUnitsRevive(finalCoordinates);
    },
    [relativeCoordinates, onUnitsRevive, area]
  );

  const unitSquaresCompRef = useRef<UnitSquaresCommands>(null);

  const setHighlightsOfRelativeCoordinates = (colIdx: number, rowIdx: number, highlighted: boolean) => {
    relativeCoordinates.forEach((relativeCoordinate) => {
      if (!unitSquaresCompRef.current) {
        return;
      }
      unitSquaresCompRef.current.setUnitHighlighted(
        colIdx + relativeCoordinate.x,
        rowIdx + relativeCoordinate.y,
        highlighted
      );
    });
  };
  const handleUnitSquareMouseEnter = useCallback((colIdx: number, rowIdx: number) => {
    setHoveredIndexes([colIdx, rowIdx]);
  }, []);

  useEffect(() => {
    if (hoveredIndexes) {
      setHighlightsOfRelativeCoordinates(hoveredIndexes[0], hoveredIndexes[1], true);
    }
    return () => {
      if (hoveredIndexes) {
        setHighlightsOfRelativeCoordinates(hoveredIndexes[0], hoveredIndexes[1], false);
      }
    };
  }, [hoveredIndexes, relativeCoordinates]);

  useEffect(() => {
    units.forEach((colOfUnits, colIdx) => {
      colOfUnits.forEach((unit, rowIdx) => {
        if (!unitSquaresCompRef.current) {
          return;
        }

        unitSquaresCompRef.current.setUnitAlive(colIdx, rowIdx, unit.alive);
      });
    });
  }, [units, unitSquaresCompRef.current]);

  useEffect(() => {
    const newFrom = cloneDeep(area.from);
    const newTo = {
      x: newFrom.x + areaWidth - 1,
      y: newFrom.x + areaHeight - 1,
    };
    onAreaUpdate({
      from: newFrom,
      to: newTo,
    });
  }, [areaWidth, areaHeight]);

  return (
    <section
      ref={rootRef}
      data-testid={dataTestids.root}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        overflow: 'hidden',
        backgroundColor: gameBackgroundColor,
      }}
    >
      <UnitSquares
        ref={unitSquaresCompRef}
        width={areaWidth}
        height={areaHeight}
        squareSize={squareSize}
        onUnitSquareClick={handleUnitSquareClick}
        onUnitSquareMouseEnter={handleUnitSquareMouseEnter}
      />
    </section>
  );
}

export default GameMap;
export { dataTestids };
