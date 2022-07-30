import { useContext, useCallback } from 'react';
import debounce from 'lodash/debounce';

import GameOfLibertyContext from '@/contexts/GameOfLiberty';
import type { AreaDTO, UnitDTO } from '@/dto';
import GameOfLifeMap from '@/components/maps/GameOfLifeMap';
import type {
  Unit,
  Coordinate,
  Area,
} from '@/components/maps/GameOfLifeMap/types';

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

function GameOfLifeMapContainer() {
  const { area, units, relativeCoordinates, status, reviveUnits, watchArea } =
    useContext(GameOfLibertyContext);

  const debounceWatchArea = debounce(watchArea, 200);

  const gameFieldUnits = convertGameOfLibertyUnitsToGameOfLifeMapUnits(
    area,
    units
  );

  const handleUnitsRevive = useCallback(
    (coordinates: Coordinate[]) => {
      reviveUnits(coordinates);
    },
    [reviveUnits]
  );

  const handleAreaUpdate = useCallback(
    (newArea: Area) => {
      if (status === 'ONLINE') {
        debounceWatchArea(newArea);
      }

      return () => {
        debounceWatchArea.cancel();
      };
    },
    [status, debounceWatchArea]
  );

  return (
    <section style={{ width: '100%', height: '100%' }}>
      {status === 'ONLINE' && (
        <GameOfLifeMap
          area={area}
          units={gameFieldUnits}
          relativeCoordinates={relativeCoordinates}
          onUnitsRevive={handleUnitsRevive}
          onAreaUpdate={handleAreaUpdate}
        />
      )}
    </section>
  );
}

export default GameOfLifeMapContainer;
