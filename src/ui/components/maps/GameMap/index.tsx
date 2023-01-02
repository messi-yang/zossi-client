import { memo, useState, useCallback } from 'react';
import GameMapCanvas from '@/ui/components/canvas/GameMapCanvas';
import { MapRangeVo, GameMapVo, LocationVo, OffsetVo } from '@/models/valueObjects';
import dataTestids from './dataTestids';

type Props = {
  mapRange: MapRangeVo | null;
  mapRangeOffset: OffsetVo;
  gameMap: GameMapVo | null;
  onGameMapUnitClick: (location: LocationVo) => any;
};

function GameMap({ mapRange, mapRangeOffset, gameMap, onGameMapUnitClick }: Props) {
  const [gameMapUnitSize] = useState<number>(30);

  const handleGameMapUnitClick = useCallback(
    (colIdx: number, rowIdx: number) => {
      if (!mapRange) {
        return;
      }

      const originLocation = mapRange.getFrom();
      const finalLocation = originLocation.shift(colIdx, rowIdx);

      onGameMapUnitClick(finalLocation);
    },
    [onGameMapUnitClick, mapRange]
  );

  return (
    <section
      data-testid={dataTestids.root}
      className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black"
    >
      <section
        className="relative flex"
        style={{
          left: mapRangeOffset.getX() * gameMapUnitSize,
          top: mapRangeOffset.getY() * gameMapUnitSize,
        }}
      >
        {gameMap && (
          <GameMapCanvas gameMap={gameMap} gameMapUnitSize={gameMapUnitSize} onClick={handleGameMapUnitClick} />
        )}
      </section>
    </section>
  );
}

export default memo(GameMap);
export { dataTestids };
