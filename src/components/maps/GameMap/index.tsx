import { memo, useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { gameBackgroundColor } from '@/styles/colors';
import UnitMapCanvas from '@/components/canvas/UnitMapCanvas';
import useDomRect from '@/hooks/useDomRect';
import useResolutionCalculator from '@/hooks/useResolutionCalculator';
import { AreaVO, UnitMapVO, CoordinateVO, OffsetVO, UnitPatternVO, MapSizeVO } from '@/valueObjects';
import { generateAreaWithCoordinateAndMapSize } from '@/valueObjects/factories';
import dataTestids from './dataTestids';

function calculateUnitPatternOffset(unitPattern: UnitPatternVO): OffsetVO {
  return new OffsetVO(-Math.floor(unitPattern.getWidth() / 2), -Math.floor(unitPattern.getHeight() / 2));
}

type Props = {
  area: AreaVO | null;
  areaOffset: OffsetVO;
  unitMap: UnitMapVO | null;
  unitPattern: UnitPatternVO;
  onUnitsRevive: (coordinate: CoordinateVO, unitPatternOffset: OffsetVO, unitPattern: UnitPatternVO) => any;
  onAreaUpdate: (newArea: AreaVO) => any;
};

function GameMap({ area, areaOffset, unitMap, unitPattern, onUnitsRevive, onAreaUpdate }: Props) {
  const [squareSize] = useState<number>(15);
  const rootRef = useRef<HTMLElement>(null);
  const rootElemRect = useDomRect(rootRef);
  const [desiredAreaWidth, desiredAreaHeight] = useResolutionCalculator(
    { width: rootElemRect.width, height: rootElemRect.height },
    squareSize
  );
  const desiredMapSize = useMemo(
    () => new MapSizeVO(desiredAreaWidth, desiredAreaHeight),
    [desiredAreaWidth, desiredAreaHeight]
  );
  const [unitPatternOffset, setUnitPatternOffset] = useState<OffsetVO>(calculateUnitPatternOffset(unitPattern));

  useEffect(() => {
    setUnitPatternOffset(calculateUnitPatternOffset(unitPattern));
  }, [unitPattern]);

  const handleUnitSquareClick = useCallback(
    (colIdx: number, rowIdx: number) => {
      if (!area || !unitPattern) {
        return;
      }

      const originCoordinate = area.getFrom();
      const finalCoordinate = originCoordinate.shift(colIdx, rowIdx);

      onUnitsRevive(finalCoordinate, unitPatternOffset, unitPattern);
    },
    [unitPattern, unitPatternOffset, onUnitsRevive, area]
  );

  useEffect(() => {
    if (area === null) {
      const newArea = generateAreaWithCoordinateAndMapSize(new CoordinateVO(0, 0), desiredMapSize);
      onAreaUpdate(newArea);
    } else {
      const newArea = generateAreaWithCoordinateAndMapSize(area.getFrom(), desiredMapSize);
      onAreaUpdate(newArea);
    }
  }, [area === null, desiredMapSize]);

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
