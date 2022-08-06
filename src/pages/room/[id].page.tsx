import { useContext, useEffect } from 'react';
import type { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { wrapper } from '@/stores';
import { gameBackgroundColor } from '@/styles/colors';
import { getInitialLocale } from '@/utils/i18n';
import GameRoomContext from '@/contexts/GameRoom';
import GameRoomSideBar from '@/components/sidebars/GameRoomSideBar';
import GameMap from '@/components/maps/GameMap';

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
  } = useContext(GameRoomContext);

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
      <section
        style={{
          flexGrow: '1',
          overflow: 'hidden',
          backgroundColor: gameBackgroundColor,
        }}
      >
        <section style={{ width: '100%', height: '100%' }}>
          {status === 'ONLINE' && (
            <GameMap
              area={area}
              units={units}
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

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [{ params: { id: 'general' } }],
  fallback: true,
});

export const getStaticProps: GetStaticProps = wrapper.getStaticProps(
  () =>
    async ({ locale }) => ({
      props: {
        ...(await serverSideTranslations(getInitialLocale(locale), ['room'])),
      },
    })
);

export default Room;
