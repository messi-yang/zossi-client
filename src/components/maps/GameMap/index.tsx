import { memo, useRef, useState, useCallback, useEffect, useMemo } from 'react';
import { gameBackgroundColor } from '@/styles/colors';
import UnitMapCanvas from '@/components/canvas/UnitMapCanvas';
import useDomRect from '@/hooks/useDomRect';
import useResolutionCalculator from '@/hooks/useResolutionCalculator';
import {
  AreaValueObject,
  UnitMapValueObject,
  CoordinateValueObject,
  OffsetValueObject,
  UnitPatternValueObject,
} from '@/valueObjects';
import {
  createCoordinate,
  createMapSize,
  createOffset,
  createAreaByCoordinateAndMapSize,
} from '@/valueObjects/factories';
import dataTestids from './dataTestids';

function calculateUnitPatternOffset(unitPattern: UnitPatternValueObject): OffsetValueObject {
  return createOffset(-Math.floor(unitPattern.getWidth() / 2), -Math.floor(unitPattern.getHeight() / 2));
}

type Props = {
  area: AreaValueObject | null;
  areaOffset: OffsetValueObject;
  unitMap: UnitMapValueObject | null;
  unitPattern: UnitPatternValueObject;
  onUnitsRevive: (
    coordinate: CoordinateValueObject,
    unitPatternOffset: OffsetValueObject,
    unitPattern: UnitPatternValueObject
  ) => any;
  onAreaUpdate: (newArea: AreaValueObject) => any;
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
    () => createMapSize(desiredAreaWidth, desiredAreaHeight),
    [desiredAreaWidth, desiredAreaHeight]
  );
  const [unitPatternOffset, setUnitPatternOffset] = useState<OffsetValueObject>(
    calculateUnitPatternOffset(unitPattern)
  );

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
      const newArea = createAreaByCoordinateAndMapSize(createCoordinate(0, 0), desiredMapSize);
      onAreaUpdate(newArea);
    } else {
      const newArea = createAreaByCoordinateAndMapSize(area.getFrom(), desiredMapSize);
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
