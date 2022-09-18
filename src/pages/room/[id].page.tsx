import { useContext, useState, useEffect } from 'react';
import type { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { wrapper } from '@/stores';
import { gameBackgroundColor } from '@/styles/colors';
import { getInitialLocale } from '@/utils/i18n';
import useWindowSize from '@/hooks/useWindowSize';
import GameRoomContext from '@/contexts/GameRoom';
import { AreaValueObject } from '@/valueObjects';
import GameRoomSideBar from '@/components/sidebars/GameRoomSideBar';
import GameMap from '@/components/maps/GameMap';
import GameMiniMap from '@/components/maps/GameMiniMap';

const Room: NextPage = function Room() {
  const windowSize = useWindowSize();
  const deviceSize: 'large' | 'small' = windowSize.width > 700 ? 'large' : 'small';
  const router = useRouter();
  const {
    mapSize,
    zoomedArea,
    zoomedAreaOffset,
    targetArea,
    unitMap,
    status,
    unitPattern,
    leaveGame,
    reviveUnitsWithPattern,
    zoomArea,
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
    if (status === 'CLOSED') {
      router.push('/');
    }
  }, [status]);

  const handleLogoClick = () => {
    leaveGame();
    router.push('/');
  };

  const handleAreaUpdate = (newArea: AreaValueObject) => {
    zoomArea(newArea);
  };

  const handleMiniMapClick = () => {
    setIsMiniMapVisible(!isMiniMapVisible);
  };

  return (
    <>
      {deviceSize === 'large' && (
        <main className="flex" style={{ width: windowSize.width, height: windowSize.height }}>
          <section className="shrink-0">
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
            className="relative grow overflow-hidden"
            style={{
              backgroundColor: gameBackgroundColor,
            }}
          >
            <section className="w-full h-full">
              {status === 'CONNECTED' && (
                <GameMap
                  area={zoomedArea}
                  areaOffset={zoomedAreaOffset}
                  unitMap={unitMap}
                  unitPattern={unitPattern}
                  onUnitsRevive={reviveUnitsWithPattern}
                  onAreaUpdate={zoomArea}
                />
              )}
            </section>
            {mapSize && targetArea && isMiniMapVisible && (
              <section className="absolute right-5 bottom-5 opacity-80 inline-flex">
                <GameMiniMap width={300} mapSize={mapSize} area={targetArea} onAreaUpdate={handleAreaUpdate} />
              </section>
            )}
          </section>
        </main>
      )}
      {deviceSize === 'small' && (
        <main className="flex flex-col" style={{ width: windowSize.width, height: windowSize.height }}>
          <section
            className="relative grow overflow-hidden"
            style={{
              backgroundColor: gameBackgroundColor,
            }}
          >
            <section className="w-full h-full">
              {status === 'CONNECTED' && (
                <GameMap
                  area={zoomedArea}
                  areaOffset={zoomedAreaOffset}
                  unitMap={unitMap}
                  unitPattern={unitPattern}
                  onUnitsRevive={reviveUnitsWithPattern}
                  onAreaUpdate={zoomArea}
                />
              )}
            </section>
            {mapSize && targetArea && isMiniMapVisible && (
              <section className="absolute left-1/2 bottom-5 opacity-80 inline-flex translate-x-[-50%]">
                <GameMiniMap
                  width={windowSize.width * 0.8}
                  mapSize={mapSize}
                  area={targetArea}
                  onAreaUpdate={handleAreaUpdate}
                />
              </section>
            )}
          </section>
          <section className="shrink-0">
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
  paths: [{ params: { id: 'a' } }],
  fallback: true,
});

export const getStaticProps: GetStaticProps = wrapper.getStaticProps(() => async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(getInitialLocale(locale), ['room'])),
  },
}));

export default Room;
