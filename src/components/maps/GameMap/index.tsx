import { memo, useRef, useState, useCallback, useEffect } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { gameBackgroundColor } from '@/styles/colors';
import useDomRect from '@/hooks/useDomRect';
import useResolutionCalculator from '@/hooks/useResolutionCalculator';
import type { AreaVO, UnitVO, CoordinateVO } from '@/valueObjects';
import dataTestids from './dataTestids';
import UnitSquares from './subComponents/UnitSquares';
import type { Commands as UnitSquaresCommands } from './subComponents/UnitSquares';

function calculateDisplayedAreaOffset(
  displayedArea: AreaVO | null,
  targetArea: AreaVO | null,
  squareSize: number
): [offsetX: number, offsetY: number] {
  if (!displayedArea || !targetArea) {
    return [0, 0];
  }
  return [
    (displayedArea.from.x - targetArea.from.x) * squareSize,
    (displayedArea.from.y - targetArea.from.y) * squareSize,
  ];
}

type Props = {
  displayedArea: AreaVO | null;
  targetArea: AreaVO | null;
  units: UnitVO[][];
  relativeCoordinates: CoordinateVO[] | null;
  onUnitsRevive: (coordinates: CoordinateVO[]) => any;
  onAreaUpdate: (newArea: AreaVO) => any;
};

function GameMap({ displayedArea, targetArea, units, relativeCoordinates, onUnitsRevive, onAreaUpdate }: Props) {
  const [squareSize] = useState<number>(25);
  const rootRef = useRef<HTMLElement>(null);
  const rootElemRect = useDomRect(rootRef);
  const [desiredAreaWidth, desiredAreaHeight] = useResolutionCalculator(
    { width: rootElemRect.width, height: rootElemRect.height },
    squareSize
  );
  const [hoveredIndexes, setHoveredIndexes] = useState<[colIdx: number, rowIdx: number] | null>(null);
  const [displayedAreaOffsets, setDisplayedAreaOffsets] = useState<[offsetX: number, offsetY: number]>(
    calculateDisplayedAreaOffset(displayedArea, targetArea, squareSize)
  );

  useEffect(() => {
    setDisplayedAreaOffsets(calculateDisplayedAreaOffset(displayedArea, targetArea, squareSize));
  }, [displayedArea, targetArea]);

  const handleUnitSquareClick = useCallback(
    (colIdx: number, rowIdx: number) => {
      if (!displayedArea || !relativeCoordinates) {
        return;
      }
      const finalCoordinates = relativeCoordinates.map((relativeCoordinate) => ({
        x: displayedArea.from.x + colIdx + relativeCoordinate.x,
        y: displayedArea.from.y + rowIdx + relativeCoordinate.y,
      }));

      onUnitsRevive(finalCoordinates);
    },
    [relativeCoordinates, onUnitsRevive, displayedArea]
  );

  const unitSquaresCompRef = useRef<UnitSquaresCommands>(null);

  const setHighlightsOfRelativeCoordinates = (colIdx: number, rowIdx: number, highlighted: boolean) => {
    if (!relativeCoordinates) {
      return;
    }

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

  const generateNewAreaAndTriggerUpdate = (from: CoordinateVO, areaWidth: number, areaHeight: number) => {
    const to = {
      x: from.x + areaWidth - 1,
      y: from.y + areaHeight - 1,
    };

    onAreaUpdate({
      from,
      to,
    });
  };

  useEffect(() => {
    if (displayedArea === null) {
      generateNewAreaAndTriggerUpdate({ x: 0, y: 0 }, desiredAreaWidth, desiredAreaHeight);
    } else {
      generateNewAreaAndTriggerUpdate(cloneDeep(displayedArea.from), desiredAreaWidth, desiredAreaHeight);
    }
  }, [displayedArea === null, desiredAreaWidth, desiredAreaHeight]);

  return (
    <section
      ref={rootRef}
      data-testid={dataTestids.root}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        backgroundColor: gameBackgroundColor,
      }}
    >
      <section
        style={{
          position: 'relative',
          left: displayedAreaOffsets[0],
          top: displayedAreaOffsets[1],
          width: '100%',
          height: '100%',
          display: 'flex',
        }}
      >
        <UnitSquares
          ref={unitSquaresCompRef}
          width={desiredAreaWidth}
          height={desiredAreaHeight}
          units={units}
          squareSize={squareSize}
          onUnitSquareClick={handleUnitSquareClick}
          onUnitSquareMouseEnter={handleUnitSquareMouseEnter}
        />
      </section>
    </section>
  );
}

export default memo(GameMap);
export { dataTestids };
