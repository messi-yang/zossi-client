import { memo, useCallback } from 'react';
import UnitMapCanvas from '@/ui/components/canvas/UnitMapCanvas';
import { MapRangeVo, UnitMapVo, LocationVo, OffsetVo } from '@/models/valueObjects';
import dataTestids from './dataTestids';
import { ItemAgg } from '@/models/aggregates';

type Props = {
  mapRange: MapRangeVo | null;
  mapRangeOffset: OffsetVo | null;
  unitMap: UnitMapVo | null;
  mapUnitSize: number;
  items: ItemAgg[] | null;
  selectedItemId: string | null;
  onMapUnitClick: (location: LocationVo) => any;
};

function UnitMap({ mapRange, mapRangeOffset, unitMap, mapUnitSize, items, selectedItemId, onMapUnitClick }: Props) {
  const handleMapUnitClick = useCallback(
    (colIdx: number, rowIdx: number) => {
      if (!mapRange) {
        return;
      }

      const originLocation = mapRange.getFrom();
      const finalLocation = originLocation.shift(colIdx, rowIdx);

      onMapUnitClick(finalLocation);
    },
    [onMapUnitClick, mapRange]
  );

  return (
    <section data-testid={dataTestids.root} className="relative w-full h-full flex overflow-hidden bg-slate-300">
      <section
        className="relative flex"
        style={{
          left: mapRangeOffset ? mapRangeOffset.getX() * mapUnitSize : 0,
          top: mapRangeOffset ? mapRangeOffset.getY() * mapUnitSize : 0,
        }}
      >
        {unitMap && (
          <UnitMapCanvas
            unitMap={unitMap}
            mapUnitSize={mapUnitSize}
            items={items || []}
            selectedItemId={selectedItemId}
            onClick={handleMapUnitClick}
          />
        )}
      </section>
    </section>
  );
}

export default memo(UnitMap);
export { dataTestids };
