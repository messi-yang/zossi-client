import { memo, useRef, useState, useCallback, useEffect } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { gameBackgroundColor } from '@/styles/colors';
import useDomRect from '@/hooks/useDomRect';
import useResolutionCalculator from '@/hooks/useResolutionCalculator';
import type { AreaVO, UnitVO, CoordinateVO, OffsetVO, UnitPatternVO } from '@/valueObjects';
import dataTestids from './dataTestids';
import UnitSquares from './subComponents/UnitSquares';
import type { Commands as UnitSquaresCommands } from './subComponents/UnitSquares';

function calculateZoomedAreaOffset(zoomedArea: AreaVO | null, targetArea: AreaVO | null, squareSize: number): OffsetVO {
  if (!zoomedArea || !targetArea) {
    return { x: 0, y: 0 };
  }
  return {
    x: (zoomedArea.from.x - targetArea.from.x) * squareSize,
    y: (zoomedArea.from.y - targetArea.from.y) * squareSize,
  };
}

function calculateUnitPatternOffset(unitPattern: UnitPatternVO): OffsetVO {
  return {
    x: -Math.floor(unitPattern.length / 2),
    y: -Math.floor(unitPattern[0] ? unitPattern[0].length / 2 : 0),
  };
}

type Props = {
  zoomedArea: AreaVO | null;
  targetArea: AreaVO | null;
  unitMap: UnitVO[][] | null;
  unitPattern: UnitPatternVO;
  onUnitsRevive: (coordinate: CoordinateVO, unitPatternOffset: OffsetVO, unitPattern: UnitPatternVO) => any;
  onAreaUpdate: (newArea: AreaVO) => any;
};

function GameMap({ zoomedArea, targetArea, unitMap, unitPattern, onUnitsRevive, onAreaUpdate }: Props) {
  const [squareSize] = useState<number>(15);
  const rootRef = useRef<HTMLElement>(null);
  const rootElemRect = useDomRect(rootRef);
  const [desiredAreaWidth, desiredAreaHeight] = useResolutionCalculator(
    { width: rootElemRect.width, height: rootElemRect.height },
    squareSize
  );
  const [hoveredIndexes, setHoveredIndexes] = useState<[colIdx: number, rowIdx: number] | null>(null);
  const [zoomedAreaOffset, setZoomedAreaOffset] = useState<OffsetVO>(
    calculateZoomedAreaOffset(zoomedArea, targetArea, squareSize)
  );
  const [unitPatternOffset, setUnitPatternOffset] = useState<OffsetVO>(calculateUnitPatternOffset(unitPattern));

  useEffect(() => {
    setUnitPatternOffset(calculateUnitPatternOffset(unitPattern));
  }, [unitPattern]);

  useEffect(() => {
    setZoomedAreaOffset(calculateZoomedAreaOffset(zoomedArea, targetArea, squareSize));
  }, [zoomedArea, targetArea]);

  const handleUnitSquareClick = useCallback(
    (colIdx: number, rowIdx: number) => {
      if (!zoomedArea || !unitPattern) {
        return;
      }

      const finalCoordinate = {
        x: zoomedArea.from.x + colIdx,
        y: zoomedArea.from.y + rowIdx,
      };

      onUnitsRevive(finalCoordinate, unitPatternOffset, unitPattern);
    },
    [unitPattern, unitPatternOffset, onUnitsRevive, zoomedArea]
  );

  const unitSquaresCompRef = useRef<UnitSquaresCommands>(null);

  const highlightUnitMapWithCoordinateAndPattern = (colIdx: number, rowIdx: number, highlighted: boolean) => {
    if (!unitPattern) {
      return;
    }

    unitPattern.forEach((unitCol, unitPatternColIdx) => {
      unitCol.forEach((isTruthy, unitPatternRowIdx) => {
        if (!unitSquaresCompRef.current) {
          return;
        }
        if (isTruthy) {
          unitSquaresCompRef.current.setUnitHighlighted(
            colIdx + unitPatternColIdx + unitPatternOffset.x,
            rowIdx + unitPatternRowIdx + unitPatternOffset.y,
            highlighted
          );
        }
      });
    });
  };
  const handleUnitSquareMouseEnter = useCallback((colIdx: number, rowIdx: number) => {
    setHoveredIndexes([colIdx, rowIdx]);
  }, []);

  useEffect(() => {
    if (hoveredIndexes) {
      highlightUnitMapWithCoordinateAndPattern(hoveredIndexes[0], hoveredIndexes[1], true);
    }
    return () => {
      if (hoveredIndexes) {
        highlightUnitMapWithCoordinateAndPattern(hoveredIndexes[0], hoveredIndexes[1], false);
      }
    };
  }, [hoveredIndexes, unitPattern]);

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
    if (zoomedArea === null) {
      generateNewAreaAndTriggerUpdate({ x: 0, y: 0 }, desiredAreaWidth, desiredAreaHeight);
    } else {
      generateNewAreaAndTriggerUpdate(cloneDeep(zoomedArea.from), desiredAreaWidth, desiredAreaHeight);
    }
  }, [zoomedArea === null, desiredAreaWidth, desiredAreaHeight]);

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
          left: zoomedAreaOffset.x,
          top: zoomedAreaOffset.y,
          width: '100%',
          height: '100%',
          display: 'flex',
        }}
      >
        {unitMap && (
          <UnitSquares
            ref={unitSquaresCompRef}
            width={desiredAreaWidth}
            height={desiredAreaHeight}
            unitMap={unitMap}
            squareSize={squareSize}
            onUnitSquareClick={handleUnitSquareClick}
            onUnitSquareMouseEnter={handleUnitSquareMouseEnter}
          />
        )}
      </section>
    </section>
  );
}

export default memo(GameMap);
export { dataTestids };
