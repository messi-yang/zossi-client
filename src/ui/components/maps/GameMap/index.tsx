import { memo, useRef, useState, useCallback, useEffect, useMemo } from 'react';
import UnitBlockCanvas from '@/ui/components/canvas/UnitBlockCanvas';
import useDomRect from '@/ui/hooks/useDomRect';
import useResolutionCalculator from '@/ui/hooks/useResolutionCalculator';
import { AreaVo, UnitBlockVo, CoordinateVo, OffsetVo } from '@/models/valueObjects';
import { createCoordinate, createDimension, createAreaByCoordinateAndDimension } from '@/models/valueObjects/factories';
import dataTestids from './dataTestids';

type Props = {
  area: AreaVo | null;
  areaOffset: OffsetVo;
  unitBlock: UnitBlockVo | null;
  onUnitsRevive: (coordinate: CoordinateVo) => any;
  onAreaUpdate: (newArea: AreaVo) => any;
};

function GameMap({ area, areaOffset, unitBlock, onUnitsRevive, onAreaUpdate }: Props) {
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

  const handleUnitSquareClick = useCallback(
    (colIdx: number, rowIdx: number) => {
      if (!area) {
        return;
      }

      const originCoordinate = area.getFrom();
      const finalCoordinate = originCoordinate.shift(colIdx, rowIdx);

      onUnitsRevive(finalCoordinate);
    },
    [onUnitsRevive, area]
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
        {unitBlock && <UnitBlockCanvas unitBlock={unitBlock} unitSize={squareSize} onClick={handleUnitSquareClick} />}
      </section>
    </section>
  );
}

export default memo(GameMap);
export { dataTestids };
