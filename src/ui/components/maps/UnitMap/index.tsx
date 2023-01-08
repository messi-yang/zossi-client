import { memo, useCallback } from 'react';
import UnitMapCanvas from '@/ui/components/canvas/UnitMapCanvas';
import { RangeVo, UnitMapVo, LocationVo, OffsetVo } from '@/models/valueObjects';
import dataTestids from './dataTestids';
import { ItemAgg } from '@/models/aggregates';

type Props = {
  range: RangeVo | null;
  rangeOffset: OffsetVo | null;
  unitMap: UnitMapVo | null;
  unitSize: number;
  items: ItemAgg[] | null;
  selectedItemId: string | null;
  onUnitClick: (location: LocationVo) => any;
};

function UnitMap({ range, rangeOffset, unitMap, unitSize, items, selectedItemId, onUnitClick }: Props) {
  const handleUnitClick = useCallback(
    (colIdx: number, rowIdx: number) => {
      if (!range) {
        return;
      }

      const originLocation = range.getFrom();
      const finalLocation = originLocation.shift(colIdx, rowIdx);

      onUnitClick(finalLocation);
    },
    [onUnitClick, range]
  );

  return (
    <section data-testid={dataTestids.root} className="relative w-full h-full flex overflow-hidden bg-slate-300">
      <section
        className="relative flex"
        style={{
          left: rangeOffset ? rangeOffset.getX() * unitSize : 0,
          top: rangeOffset ? rangeOffset.getY() * unitSize : 0,
        }}
      >
        {unitMap && (
          <UnitMapCanvas
            unitMap={unitMap}
            unitSize={unitSize}
            items={items || []}
            selectedItemId={selectedItemId}
            onClick={handleUnitClick}
          />
        )}
      </section>
    </section>
  );
}

export default memo(UnitMap);
export { dataTestids };
