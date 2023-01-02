import { memo, useState, useCallback } from 'react';
import UnitBlockCanvas from '@/ui/components/canvas/UnitBlockCanvas';
import { AreaVo, UnitBlockVo, LocationVo, OffsetVo } from '@/models/valueObjects';
import dataTestids from './dataTestids';

type Props = {
  area: AreaVo | null;
  areaOffset: OffsetVo;
  unitBlock: UnitBlockVo | null;
  onUnitClick: (location: LocationVo) => any;
};

function GameMap({ area, areaOffset, unitBlock, onUnitClick }: Props) {
  const [unitSideLength] = useState<number>(30);

  const handleUnitClick = useCallback(
    (colIdx: number, rowIdx: number) => {
      if (!area) {
        return;
      }

      const originLocation = area.getFrom();
      const finalLocation = originLocation.shift(colIdx, rowIdx);

      onUnitClick(finalLocation);
    },
    [onUnitClick, area]
  );

  return (
    <section
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
