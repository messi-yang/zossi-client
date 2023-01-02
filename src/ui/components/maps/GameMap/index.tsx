import { memo, useState, useCallback } from 'react';
import GameMapCanvas from '@/ui/components/canvas/GameMapCanvas';
import { MapRangeVo, GameMapVo, LocationVo, OffsetVo } from '@/models/valueObjects';
import dataTestids from './dataTestids';

type Props = {
  mapRange: MapRangeVo | null;
  mapRangeOffset: OffsetVo;
  gameMap: GameMapVo | null;
  onMapUnitClick: (location: LocationVo) => any;
};

function GameMap({ mapRange, mapRangeOffset, gameMap, onMapUnitClick }: Props) {
  const [mapUnitSize] = useState<number>(30);

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
    <section
      data-testid={dataTestids.root}
      className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black"
    >
      <section
        className="relative flex"
        style={{
          left: mapRangeOffset.getX() * mapUnitSize,
          top: mapRangeOffset.getY() * mapUnitSize,
        }}
      >
        {gameMap && <GameMapCanvas gameMap={gameMap} mapUnitSize={mapUnitSize} onClick={handleMapUnitClick} />}
      </section>
    </section>
  );
}

export default memo(GameMap);
export { dataTestids };
