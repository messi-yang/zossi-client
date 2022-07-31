import { useContext, useEffect } from 'react';
import type { NextPage, GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import debounce from 'lodash/debounce';

import { wrapper } from '@/stores';
import { getInitialLocale } from '@/utils/i18n';
import type { AreaDTO, UnitDTO } from '@/dto';
import GameOfLibertyContext from '@/contexts/GameOfLiberty';
import GameRoomSideBar from '@/components/sidebars/GameRoomSideBar';
import GameMap from '@/components/maps/GameMap';
import type { Unit } from '@/components/maps/GameMap';

function convertGameOfLibertyUnitsToGameMapUnits(
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

const Room: NextPage = function Room() {
  const {
    area,
    units,
    status,
    relativeCoordinates,
    joinGame,
    leaveGame,
    reviveUnits,
    watchArea,
    updateRelativeCoordinates,
  } = useContext(GameOfLibertyContext);

  const debounceWatchArea = debounce(watchArea, 200);

  const gameFieldUnits = convertGameOfLibertyUnitsToGameMapUnits(area, units);

  useEffect(() => {
    if (status !== 'ONLINE') {
      joinGame();
    }

    return () => {
      if (status === 'ONLINE') {
        leaveGame();
      }
    };
  }, [status]);

  return (
    <main style={{ width: '100vw', height: '100vh', display: 'flex' }}>
      <section style={{ flexShrink: '0', height: '100%' }}>
        <GameRoomSideBar
          relativeCoordinates={relativeCoordinates}
          onRelativeCoordinatesUpdate={updateRelativeCoordinates}
        />
      </section>
      <section style={{ flexGrow: '1', overflow: 'hidden' }}>
        <section style={{ width: '100%', height: '100%' }}>
          {status === 'ONLINE' && (
            <GameMap
              area={area}
              units={gameFieldUnits}
              relativeCoordinates={relativeCoordinates}
              onUnitsRevive={reviveUnits}
              onAreaUpdate={debounceWatchArea}
            />
          )}
        </section>
      </section>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps =
  wrapper.getServerSideProps(() => async ({ locale }) => ({
    props: {
      ...(await serverSideTranslations(getInitialLocale(locale), ['room'])),
    },
  }));

export default Room;
