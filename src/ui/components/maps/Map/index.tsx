import { memo, useCallback } from 'react';
import MapCanvas from '@/ui/components/canvas/MapCanvas';
import { BoundVo, MapVo, LocationVo, OffsetVo } from '@/models/valueObjects';
import dataTestids from './dataTestids';
import { ItemAgg } from '@/models/aggregates';

type Props = {
  bound: BoundVo | null;
  boundOffset: OffsetVo | null;
  map: MapVo | null;
  unitSize: number;
  items: ItemAgg[] | null;
  selectedItemId: string | null;
  onUnitClick: (location: LocationVo) => any;
};

function Map({ bound, boundOffset, map, unitSize, items, selectedItemId, onUnitClick }: Props) {
  const handleUnitClick = useCallback(
    (colIdx: number, rowIdx: number) => {
      if (!bound) {
        return;
      }

      const originLocation = bound.getFrom();
      const finalLocation = originLocation.shift(colIdx, rowIdx);

      onUnitClick(finalLocation);
    },
    [onUnitClick, bound]
  );

  return (
    <section data-testid={dataTestids.root} className="relative w-full h-full flex overflow-hidden bg-slate-300">
      <section
        className="relative flex"
        style={{
          left: boundOffset ? boundOffset.getX() * unitSize : 0,
          top: boundOffset ? boundOffset.getY() * unitSize : 0,
        }}
      >
        {map && (
          <MapCanvas
            map={map}
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
