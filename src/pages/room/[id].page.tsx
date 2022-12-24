import { useContext, useState, useEffect, useCallback } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import useWindowSize from '@/hooks/useWindowSize';
import GameRoomContext from '@/contexts/GameRoom';
import ItemContext from '@/contexts/ItemContext';
import { AreaVo, CoordinateVo } from '@/models/valueObjects';
import GameRoomSideBar from '@/components/sidebars/GameRoomSideBar';
import GameMap from '@/components/maps/GameMap';
import GameMiniMap from '@/components/maps/GameMiniMap';
import SelectItemModal from '@/components/modals/SelectItemModal';

const Room: NextPage = function Room() {
  const windowSize = useWindowSize();
  const deviceSize: 'large' | 'small' = windowSize.width > 700 ? 'large' : 'small';
  const router = useRouter();
  const {
    dimension,
    zoomedArea,
    zoomedAreaOffset,
    targetArea,
    unitBlock,
    status,
    joinGame,
    leaveGame,
    buildItem,
    zoomArea,
  } = useContext(GameRoomContext);
  const { items } = useContext(ItemContext);
  const [isMiniMapVisible, setIsMiniMapVisible] = useState<boolean>(false);
  const [isSelectItemModalVisible, setIsSelectItemModalVisible] = useState<boolean>(false);

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

  const joinGameOnInitializationEffect = useCallback(() => {
    joinGame();
  }, [joinGame]);
  useEffect(joinGameOnInitializationEffect, [joinGameOnInitializationEffect]);

  const handleRouterLeaveEffect = useCallback(() => {
    const handleRouterChangeStart = () => {
      leaveGame();
    };

    router.events.on('routeChangeStart', handleRouterChangeStart);

    return () => {
      router.events.off('routeChangeStart', handleRouterChangeStart);
    };
  }, [leaveGame]);
  useEffect(handleRouterLeaveEffect, [handleRouterLeaveEffect]);

  const handleLogoClick = () => {
    router.push('/');
  };

  const handleAreaUpdate = (newArea: AreaVo) => {
    zoomArea(newArea);
  };

  const handleMiniMapClick = () => {
    setIsMiniMapVisible(!isMiniMapVisible);
  };

  const handleUnitPatternClick = () => {
    setIsSelectItemModalVisible(true);
  };

  const handleSelectItemDone = () => {
    setIsSelectItemModalVisible(false);
  };

  const handleUnitsRevive = useCallback(
    (coordinate: CoordinateVo) => {
      if (!items || !items[0]) {
        return;
      }

      buildItem(coordinate, items[0].getId());
    },
    [items]
  );

  return (
    <>
      {deviceSize === 'large' && (
        <main className="flex" style={{ width: windowSize.width, height: windowSize.height }}>
          <SelectItemModal
            opened={isSelectItemModalVisible}
            width={560}
            selectedItemId={null}
            items={items || []}
            onDone={handleSelectItemDone}
          />
          <section className="shrink-0">
            <GameRoomSideBar
              align="column"
              onLogoClick={handleLogoClick}
              onUnitPatternClick={handleUnitPatternClick}
              isMiniMapActive={isMiniMapVisible}
              onMiniMapClick={handleMiniMapClick}
            />
          </section>
          <section className="relative grow overflow-hidden bg-black">
            <section className="w-full h-full">
              {status === 'CONNECTED' && (
                <GameMap
                  area={zoomedArea}
                  areaOffset={zoomedAreaOffset}
                  unitBlock={unitBlock}
                  onUnitsRevive={handleUnitsRevive}
                  onAreaUpdate={zoomArea}
                />
              )}
            </section>
            {dimension && targetArea && isMiniMapVisible && (
              <section className="absolute right-5 bottom-5 opacity-80 inline-flex">
                <GameMiniMap width={300} dimension={dimension} area={targetArea} onAreaUpdate={handleAreaUpdate} />
              </section>
            )}
          </section>
        </main>
      )}
      {deviceSize === 'small' && (
        <main className="flex flex-col" style={{ width: windowSize.width, height: windowSize.height }}>
          <SelectItemModal
            opened={isSelectItemModalVisible}
            width={windowSize.width}
            selectedItemId={null}
            items={items || []}
          />
          <section className="relative grow overflow-hidden bg-black">
            <section className="w-full h-full">
              {status === 'CONNECTED' && (
                <GameMap
                  area={zoomedArea}
                  areaOffset={zoomedAreaOffset}
                  unitBlock={unitBlock}
                  onUnitsRevive={handleUnitsRevive}
                  onAreaUpdate={zoomArea}
                />
              )}
            </section>
            {dimension && targetArea && isMiniMapVisible && (
              <section className="absolute left-1/2 bottom-5 opacity-80 inline-flex translate-x-[-50%]">
                <GameMiniMap
                  width={windowSize.width * 0.8}
                  dimension={dimension}
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
              onUnitPatternClick={handleUnitPatternClick}
              isMiniMapActive={isMiniMapVisible}
              onMiniMapClick={handleMiniMapClick}
            />
          </section>
        </main>
      )}
    </>
  );
};

export default Room;
