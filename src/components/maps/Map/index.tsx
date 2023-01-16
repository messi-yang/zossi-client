import { memo, useCallback } from 'react';
import MapCanvas from '@/components/canvas/MapCanvas';
import { LocationVo, OffsetVo, ViewVo } from '@/models/valueObjects';
import dataTestids from './dataTestids';
import { ItemAgg } from '@/models/aggregates';

type Props = {
  view: ViewVo | null;
  viewOffset: OffsetVo | null;
  unitSize: number;
  items: ItemAgg[] | null;
  selectedItemId: string | null;
  onUnitClick: (location: LocationVo) => any;
};

function Map({ view, viewOffset, unitSize, items, selectedItemId, onUnitClick }: Props) {
  const handleUnitClick = useCallback(
    (colIdx: number, rowIdx: number) => {
      if (!view) {
        return;
      }

      const originLocation = view.getBound().getFrom();
      const finalLocation = originLocation.shift(colIdx, rowIdx);

      onUnitClick(finalLocation);
    },
    [onUnitClick, view]
  );

  return (
    <section data-testid={dataTestids.root} className="relative w-full h-full flex overflow-hidden bg-slate-300">
      <section
        className="relative flex"
        style={{
          left: (viewOffset?.getX() || 0) * unitSize,
          top: (viewOffset?.getY() || 0) * unitSize,
        }}
      >
        {view && (
          <MapCanvas
            map={view.getMap()}
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

export default memo(Map);
export { dataTestids };
