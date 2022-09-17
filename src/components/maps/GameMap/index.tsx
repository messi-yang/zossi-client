import { memo, useRef, useState, useCallback, useEffect } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { gameBackgroundColor } from '@/styles/colors';
import UnitMapCanvas from '@/components/canvas/UnitMapCanvas';
import useDomRect from '@/hooks/useDomRect';
import useResolutionCalculator from '@/hooks/useResolutionCalculator';
import { AreaVo, UnitVo, CoordinateVo, OffsetVo, UnitPatternVo } from '@/valueObjects';
import dataTestids from './dataTestids';

function calculateUnitPatternOffset(unitPattern: UnitPatternVo): OffsetVo {
  return new OffsetVo(-Math.floor(unitPattern.getWidth() / 2), -Math.floor(unitPattern.getHeight() / 2));
}

type Props = {
  area: AreaVo | null;
  areaOffset: OffsetVo;
  unitMap: UnitVo[][] | null;
  unitPattern: UnitPatternVo;
  onUnitsRevive: (coordinate: CoordinateVo, unitPatternOffset: OffsetVo, unitPattern: UnitPatternVo) => any;
  onAreaUpdate: (newArea: AreaVo) => any;
};

function GameMap({ area, areaOffset, unitMap, unitPattern, onUnitsRevive, onAreaUpdate }: Props) {
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
      if (!area || !unitPattern) {
        return;
      }

      const finalCoordinate = new CoordinateVo(area.getFrom().getX() + colIdx, area.getFrom().getY() + rowIdx);

      onUnitsRevive(finalCoordinate, unitPatternOffset, unitPattern);
    },
    [unitPattern, unitPatternOffset, onUnitsRevive, area]
  );

  const generateNewAreaAndTriggerUpdate = useCallback((from: CoordinateVo, areaWidth: number, areaHeight: number) => {
    const to = new CoordinateVo(from.getX() + areaWidth - 1, from.getY() + areaHeight - 1);

    onAreaUpdate(new AreaVo(from, to));
  }, []);

  useEffect(() => {
    if (area === null) {
      generateNewAreaAndTriggerUpdate(new CoordinateVo(0, 0), desiredAreaWidth, desiredAreaHeight);
    } else {
      generateNewAreaAndTriggerUpdate(cloneDeep(area.getFrom()), desiredAreaWidth, desiredAreaHeight);
    }
  }, [area === null, desiredAreaWidth, desiredAreaHeight]);

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
        style={{ left: areaOffset.getX() * squareSize, top: areaOffset.getY() * squareSize }}
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
