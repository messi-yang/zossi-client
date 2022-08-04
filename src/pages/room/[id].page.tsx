import { useContext, useEffect } from 'react';
import type { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

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
  return units.map((rowUnits, x) =>
    rowUnits.map((unit, y) => ({
      key: `${x},${y}`,
      coordinate: { x: from.x + x, y: from.y + y },
      alive: unit.alive,
      age: unit.age,
    }))
  );
}

const Room: NextPage = function Room() {
  const router = useRouter();
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

  const handleLogoClick = () => {
    router.push('/');
  };

  return (
    <main style={{ width: '100vw', height: '100vh', display: 'flex' }}>
      <section style={{ flexShrink: '0', height: '100%' }}>
        <GameRoomSideBar
          onLogoClick={handleLogoClick}
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
              onAreaUpdate={watchArea}
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
