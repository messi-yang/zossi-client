import { memo, useRef, useState, useCallback, useEffect } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { gameBackgroundColor } from '@/styles/colors';
import UnitMapCanvas from '@/components/canvas/UnitMapCanvas';
import useDomRect from '@/hooks/useDomRect';
import useResolutionCalculator from '@/hooks/useResolutionCalculator';
import type { AreaVo, UnitVo, CoordinateVo, OffsetVo, UnitPatternVo } from '@/valueObjects';
import dataTestids from './dataTestids';

function calculateUnitPatternOffset(unitPattern: UnitPatternVo): OffsetVo {
  return {
    x: -Math.floor(unitPattern.length / 2),
    y: -Math.floor(unitPattern[0] ? unitPattern[0].length / 2 : 0),
  };
}

type Props = {
  zoomedArea: AreaVo | null;
  zoomedAreaOffset: OffsetVo;
  unitMap: UnitVo[][] | null;
  unitPattern: UnitPatternVo;
  onUnitsRevive: (coordinate: CoordinateVo, unitPatternOffset: OffsetVo, unitPattern: UnitPatternVo) => any;
  onAreaUpdate: (newArea: AreaVo) => any;
};

function GameMap({ zoomedArea, zoomedAreaOffset, unitMap, unitPattern, onUnitsRevive, onAreaUpdate }: Props) {
  const [squareSize] = useState<number>(15);
  const rootRef = useRef<HTMLElement>(null);
  const rootElemRect = useDomRect(rootRef);
  const [desiredAreaWidth, desiredAreaHeight] = useResolutionCalculator(
    { width: rootElemRect.width, height: rootElemRect.height },
    squareSize
  );
  const [unitPatternOffset, setUnitPatternOffset] = useState<OffsetVo>(calculateUnitPatternOffset(unitPattern));

  useEffect(() => {
    setUnitPatternOffset(calculateUnitPatternOffset(unitPattern));
  }, [unitPattern]);

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

  const generateNewAreaAndTriggerUpdate = useCallback((from: CoordinateVo, areaWidth: number, areaHeight: number) => {
    const to = {
      x: from.x + areaWidth - 1,
      y: from.y + areaHeight - 1,
    };

    onAreaUpdate({
      from,
      to,
    });
  }, []);

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
      className="relative w-full h-full overflow-hidden"
      style={{
        backgroundColor: gameBackgroundColor,
      }}
    >
      <section
        className="relative w-full h-full flex"
        style={{ left: zoomedAreaOffset.x * squareSize, top: zoomedAreaOffset.y * squareSize }}
      >
        {unitMap && (
          <UnitMapCanvas
            unitMap={unitMap}
            unitSize={squareSize}
            unitPattern={unitPattern}
            onClick={handleUnitSquareClick}
          />
        )}
      </section>
    </section>
  );
}

export default memo(GameMap);
export { dataTestids };
