import { useRef, useContext, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';

import GameOfLibertyContext from '@/contexts/GameOfLiberty';
import useResolutionCalculator from '@/hooks/useResolutionCalculator';
import type { AreaDTO, UnitDTO } from '@/dto';
import GameOfLifeMap from '@/components/maps/GameOfLifeMap';
import type { Unit, Coordinate } from '@/components/maps/GameOfLifeMap/types';
import useDomRect from '@/hooks/useDomRect';

function convertGameOfLibertyUnitsToGameOfLifeMapUnits(
  area: AreaDTO,
  units: UnitDTO[][]
): Unit[][] {
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
  const wrapperRect = useDomRect(wrapperRef);
  const [mapWidth, mapHeight] = useResolutionCalculator(
    { width: wrapperRect.width, height: wrapperRect.height },
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
    (coordinates: Coordinate[]) => {
      reviveUnits(coordinates);
    },
    [reviveUnits]
  );

  const relatCoordsForRevival = [
    { x: 0, y: 0 },
    { x: -1, y: -1 },
    { x: 1, y: 1 },
  ];

  return (
    <section ref={wrapperRef} style={{ width: '100%', height: '100%' }}>
      <GameOfLifeMap
        area={area}
        units={gameFieldUnits}
        relatCoordsForRevival={relatCoordsForRevival}
        onUnitsRevive={onUnitsRevive}
      />
    </section>
  );
}

export default GameOfLifeMapContainer;
