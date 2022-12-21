import { memo, useRef, useState, useCallback, useEffect, useMemo } from 'react';
import UnitBlockCanvas from '@/components/canvas/UnitBlockCanvas';
import useDomRect from '@/hooks/useDomRect';
import useResolutionCalculator from '@/hooks/useResolutionCalculator';
import {
  AreaValueObject,
  UnitBlockValueObject,
  CoordinateValueObject,
  OffsetValueObject,
  UnitPatternValueObject,
} from '@/models/valueObjects';
import {
  createCoordinate,
  createDimension,
  createOffset,
  createAreaByCoordinateAndDimension,
} from '@/models/valueObjects/factories';
import dataTestids from './dataTestids';

function calculateUnitPatternOffset(unitPattern: UnitPatternValueObject): OffsetValueObject {
  return createOffset(-Math.floor(unitPattern.getWidth() / 2), -Math.floor(unitPattern.getHeight() / 2));
}

type Props = {
  area: AreaValueObject | null;
  areaOffset: OffsetValueObject;
  unitBlock: UnitBlockValueObject | null;
  unitPattern: UnitPatternValueObject;
  onUnitsRevive: (
    coordinate: CoordinateValueObject,
    unitPatternOffset: OffsetValueObject,
    unitPattern: UnitPatternValueObject
  ) => any;
  onAreaUpdate: (newArea: AreaValueObject) => any;
};

function GameMap({ area, areaOffset, unitBlock, unitPattern, onUnitsRevive, onAreaUpdate }: Props) {
  const [squareSize] = useState<number>(15);
  const rootRef = useRef<HTMLElement>(null);
  const rootElemRect = useDomRect(rootRef);
  const [desiredAreaWidth, desiredAreaHeight] = useResolutionCalculator(
    { width: rootElemRect.width, height: rootElemRect.height },
    squareSize
  );
  const desiredDimension = useMemo(
    () => createDimension(desiredAreaWidth, desiredAreaHeight),
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
      const newArea = createAreaByCoordinateAndDimension(createCoordinate(0, 0), desiredDimension);
      onAreaUpdate(newArea);
    } else {
      const newArea = createAreaByCoordinateAndDimension(area.getFrom(), desiredDimension);
      onAreaUpdate(newArea);
    }
  }, [area === null, desiredDimension]);

  return (
    <section ref={rootRef} data-testid={dataTestids.root} className="relative w-full h-full overflow-hidden bg-black">
      <section
        className="relative w-full h-full flex"
        style={{ left: areaOffset.getX() * squareSize, top: areaOffset.getY() * squareSize }}
      >
        {unitBlock && (
          <UnitBlockCanvas
            unitBlock={unitBlock}
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
