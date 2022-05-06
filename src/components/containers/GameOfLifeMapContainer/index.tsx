import { useRef, useContext, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';

import GameOfLibertyContext from '@/contexts/GameOfLiberty';
import useElementResolutionCalculator from '@/hooks/useElementResolutionCalculator';
import type {
  Area as GameOfLibertyArea,
  Units as GameOfLibertyUnits,
} from '@/contexts/GameOfLiberty';
import GameOfLifeMap from '@/components/maps/GameOfLifeMap';
import type {
  Units as GameOfLifeMapUnits,
  Coordinate as GameOfLifeCoordinate,
} from '@/components/maps/GameOfLifeMap';

function convertGameOfLibertyUnitsToGameOfLifeMapUnits(
  area: GameOfLibertyArea,
  units: GameOfLibertyUnits
): GameOfLifeMapUnits {
  const { from } = area;
  return units.map((rowUnits, rowIdx) =>
    rowUnits.map((unit, colIdx) => ({
      coordinate: { x: from.x + rowIdx, y: from.y + colIdx },
      alive: unit.alive,
      age: unit.age,
    }))
  );
}

type Props = {
  unitSize: number;
};

function GameOfLifeMapContainer({ unitSize }: Props) {
  const wrapperRef = useRef<HTMLElement>(null);
  const [mapWidth, mapHeight] = useElementResolutionCalculator(
    wrapperRef,
    unitSize
  );

  const { area, units, status, reviveUnits, watchArea } =
    useContext(GameOfLibertyContext);

  const debounceWatchArea = debounce(watchArea, 200);

  useEffect(() => {
    if (status === 'ONLINE') {
      debounceWatchArea({
        from: {
          x: 0,
          y: 0,
        },
        to: {
          x: mapWidth - 1,
          y: mapHeight - 1,
        },
      });
    }

    return () => {
      debounceWatchArea.cancel();
    };
  }, [status, mapWidth, mapHeight]);

  const gameFieldUnits = convertGameOfLibertyUnitsToGameOfLifeMapUnits(
    area,
    units
  );

  const onUnitsRevive = useCallback(
    (coordinates: GameOfLifeCoordinate[]) => {
      reviveUnits(coordinates);
    },
    [reviveUnits]
  );

  return (
    <section ref={wrapperRef} style={{ width: '100%', height: '100%' }}>
      <GameOfLifeMap units={gameFieldUnits} onUnitsRevive={onUnitsRevive} />
    </section>
  );
}

export default GameOfLifeMapContainer;
