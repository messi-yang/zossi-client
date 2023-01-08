import { memo, useCallback } from 'react';
import UnitMapCanvas from '@/ui/components/canvas/UnitMapCanvas';
import { ExtentVo, UnitMapVo, LocationVo, OffsetVo } from '@/models/valueObjects';
import dataTestids from './dataTestids';
import { ItemAgg } from '@/models/aggregates';

type Props = {
  extent: ExtentVo | null;
  extentOffset: OffsetVo | null;
  unitMap: UnitMapVo | null;
  unitSize: number;
  items: ItemAgg[] | null;
  selectedItemId: string | null;
  onUnitClick: (location: LocationVo) => any;
};

function UnitMap({ extent, extentOffset, unitMap, unitSize, items, selectedItemId, onUnitClick }: Props) {
  const handleUnitClick = useCallback(
    (colIdx: number, rowIdx: number) => {
      if (!extent) {
        return;
      }

      const originLocation = extent.getFrom();
      const finalLocation = originLocation.shift(colIdx, rowIdx);

      onUnitClick(finalLocation);
    },
    [onUnitClick, extent]
  );

  return (
    <section data-testid={dataTestids.root} className="relative w-full h-full flex overflow-hidden bg-slate-300">
      <section
        className="relative flex"
        style={{
          left: extentOffset ? extentOffset.getX() * unitSize : 0,
          top: extentOffset ? extentOffset.getY() * unitSize : 0,
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
