import { memo, useRef, useState, useCallback, useEffect, useMemo } from 'react';
import UnitBlockCanvas from '@/ui/components/canvas/UnitBlockCanvas';
import useDomRect from '@/ui/hooks/useDomRect';
import { AreaVo, UnitBlockVo, CoordinateVo, OffsetVo } from '@/models/valueObjects';
import {
  createCoordinate,
  createAreaByCoordinateAndDimension,
  calculateDimensionByResolutionAndUnitSideLength,
} from '@/models/valueObjects/factories';
import dataTestids from './dataTestids';

type Props = {
  area: AreaVo | null;
  areaOffset: OffsetVo;
  unitBlock: UnitBlockVo | null;
  onUnitClick: (coordinate: CoordinateVo) => any;
  onAreaUpdate: (newArea: AreaVo) => any;
};

function GameMap({ area, areaOffset, unitBlock, onUnitClick, onAreaUpdate }: Props) {
  const [unitSideLength] = useState<number>(30);
  const rootRef = useRef<HTMLElement>(null);
  const rootElemRect = useDomRect(rootRef);
  const desiredDimension = useMemo(
    () =>
      calculateDimensionByResolutionAndUnitSideLength(
        { width: rootElemRect.width, height: rootElemRect.height },
        unitSideLength
      ),
    [rootElemRect.width, rootElemRect.height]
  );

  const handleUnitClick = useCallback(
    (colIdx: number, rowIdx: number) => {
      if (!area) {
        return;
      }

      const originCoordinate = area.getFrom();
      const finalCoordinate = originCoordinate.shift(colIdx, rowIdx);

      onUnitClick(finalCoordinate);
    },
    [onUnitClick, area]
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
    <section
      ref={rootRef}
      data-testid={dataTestids.root}
      className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black"
    >
      <section
        className="relative flex"
        style={{ left: areaOffset.getX() * unitSideLength, top: areaOffset.getY() * unitSideLength }}
      >
        {unitBlock && <UnitBlockCanvas unitBlock={unitBlock} unitSize={unitSideLength} onClick={handleUnitClick} />}
      </section>
    </section>
  );
}

export default memo(GameMap);
export { dataTestids };
