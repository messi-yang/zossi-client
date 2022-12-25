import { useContext, useState, useEffect, useCallback } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import useWindowSize from '@/hooks/useWindowSize';
import GameContext from '@/contexts/GameContext';
import { AreaVo, CoordinateVo } from '@/models/valueObjects';
import GameRoomSideBar from '@/components/sidebars/GameRoomSideBar';
import GameMap from '@/components/maps/GameMap';
import GameMiniMap from '@/components/maps/GameMiniMap';
import SelectItemModal from '@/components/modals/SelectItemModal';
import { ItemAgg } from '@/models/aggregates';

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
    items,
    selectedItem,
    status,
    selectItem,
    joinGame,
    leaveGame,
    buildItem,
    zoomArea,
  } = useContext(GameContext);
  const [isMiniMapVisible, setIsMiniMapVisible] = useState<boolean>(false);
  const [isSelectItemModalVisible, setIsSelectItemModalVisible] = useState<boolean>(false);

  const isBuildItemActive = !!selectedItem;

  useEffect(
    function onDeviceSizeChangeEffect() {
      if (deviceSize === 'large') {
        setIsMiniMapVisible(true);
        return;
      }
      setIsMiniMapVisible(false);
    },
    [deviceSize]
  );

  useEffect(
    function onStatusChangeEffect() {
      if (status === 'CLOSED') {
        router.push('/');
      }
    },
    [status]
  );

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

  const handleBuildItemClick = () => {
    setIsSelectItemModalVisible(true);
  };

  const handleSelectItemDone = () => {
    setIsSelectItemModalVisible(false);
  };

  const handleItemSelect = (item: ItemAgg) => {
    selectItem(item);
  };

  const handleUnitsRevive = useCallback(
    (coordinate: CoordinateVo) => {
      if (!selectedItem) {
        return;
      }

      buildItem(coordinate, selectedItem.getId());
    },
    [selectedItem]
  );

  return (
    <>
      {deviceSize === 'large' && (
        <main className="flex" style={{ width: windowSize.width, height: windowSize.height }}>
          <SelectItemModal
            opened={isSelectItemModalVisible}
            width={560}
            selectedItem={selectedItem}
            items={items || []}
            onSelect={handleItemSelect}
            onDone={handleSelectItemDone}
          />
          <section className="shrink-0">
            <GameRoomSideBar
              align="column"
              onLogoClick={handleLogoClick}
              isBuildItemActive={isBuildItemActive}
              onBuildItemClick={handleBuildItemClick}
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
            selectedItem={selectedItem}
            items={items || []}
            onSelect={handleItemSelect}
            onDone={handleSelectItemDone}
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
              isBuildItemActive={isBuildItemActive}
              onBuildItemClick={handleBuildItemClick}
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
