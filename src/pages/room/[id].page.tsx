import { useContext, useState, useEffect } from 'react';
import type { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { wrapper } from '@/stores';
import { gameBackgroundColor } from '@/styles/colors';
import { getInitialLocale } from '@/utils/i18n';
import useWindowSize from '@/hooks/useWindowSize';
import GameRoomContext from '@/contexts/GameRoom';
import { AreaVO } from '@/valueObjects';
import GameRoomSideBar from '@/components/sidebars/GameRoomSideBar';
import GameMap from '@/components/maps/GameMap';
import GameMiniMap from '@/components/maps/GameMiniMap';

const Room: NextPage = function Room() {
  const windowSize = useWindowSize();
  const deviceSize: 'large' | 'small' = windowSize.width > 700 ? 'large' : 'small';
  const router = useRouter();
  const {
    mapSize,
    displayedArea,
    targetArea,
    unitMap,
    status,
    unitPattern,
    joinGame,
    leaveGame,
    reviveUnitsWithPattern,
    watchArea,
    updateUnitPattern,
  } = useContext(GameRoomContext);
  const [isMiniMapVisible, setIsMiniMapVisible] = useState<boolean>(false);

  useEffect(() => {
    if (deviceSize === 'large') {
      setIsMiniMapVisible(true);
      return;
    }
    setIsMiniMapVisible(false);
  }, [deviceSize]);

  useEffect(() => {
    joinGame();

    return () => {
      leaveGame();
    };
  }, [status]);

  const handleLogoClick = () => {
    router.push('/');
  };

  const handleAreaUpdate = (newArea: AreaVO) => {
    watchArea(newArea);
  };

  const handleMiniMapClick = () => {
    setIsMiniMapVisible(!isMiniMapVisible);
  };

  return (
    <>
      {deviceSize === 'large' && (
        <main style={{ width: windowSize.width, height: windowSize.height, display: 'flex' }}>
          <section style={{ flexShrink: '0' }}>
            <GameRoomSideBar
              align="column"
              onLogoClick={handleLogoClick}
              unitPattern={unitPattern}
              onUnitPatternUpdate={updateUnitPattern}
              isMiniMapActive={isMiniMapVisible}
              onMiniMapClick={handleMiniMapClick}
            />
          </section>
          <section
            style={{
              position: 'relative',
              flexGrow: '1',
              overflow: 'hidden',
              backgroundColor: gameBackgroundColor,
            }}
          >
            <section style={{ width: '100%', height: '100%' }}>
              {status === 'ONLINE' && (
                <GameMap
                  displayedArea={displayedArea}
                  targetArea={targetArea}
                  unitMap={unitMap}
                  unitPattern={unitPattern}
                  onUnitsRevive={reviveUnitsWithPattern}
                  onAreaUpdate={watchArea}
                />
              )}
            </section>
            {mapSize && targetArea && isMiniMapVisible && (
              <section
                style={{ position: 'absolute', right: '20px', bottom: '20px', opacity: '0.8', display: 'inline-flex' }}
              >
                <GameMiniMap width={300} mapSize={mapSize} area={targetArea} onAreaUpdate={handleAreaUpdate} />
              </section>
            )}
          </section>
        </main>
      )}
      {deviceSize === 'small' && (
        <main style={{ width: windowSize.width, height: windowSize.height, display: 'flex', flexFlow: 'column' }}>
          <section
            style={{
              position: 'relative',
              flexGrow: '1',
              overflow: 'hidden',
              backgroundColor: gameBackgroundColor,
            }}
          >
            <section style={{ width: '100%', height: '100%' }}>
              {status === 'ONLINE' && (
                <GameMap
                  displayedArea={displayedArea}
                  targetArea={targetArea}
                  unitMap={unitMap}
                  unitPattern={unitPattern}
                  onUnitsRevive={reviveUnitsWithPattern}
                  onAreaUpdate={watchArea}
                />
              )}
            </section>
            {mapSize && targetArea && isMiniMapVisible && (
              <section
                style={{
                  position: 'absolute',
                  left: '50%',
                  bottom: '20px',
                  transform: 'translateX(-50%)',
                  opacity: '0.8',
                  display: 'inline-flex',
                }}
              >
                <GameMiniMap
                  width={windowSize.width * 0.8}
                  mapSize={mapSize}
                  area={targetArea}
                  onAreaUpdate={handleAreaUpdate}
                />
              </section>
            )}
          </section>
          <section style={{ flexShrink: '0' }}>
            <GameRoomSideBar
              align="row"
              onLogoClick={handleLogoClick}
              unitPattern={unitPattern}
              onUnitPatternUpdate={updateUnitPattern}
              isMiniMapActive={isMiniMapVisible}
              onMiniMapClick={handleMiniMapClick}
            />
          </section>
        </main>
      )}
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [{ params: { id: 'general' } }],
  fallback: true,
});

export const getStaticProps: GetStaticProps = wrapper.getStaticProps(() => async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(getInitialLocale(locale), ['room'])),
  },
}));

export default Room;
