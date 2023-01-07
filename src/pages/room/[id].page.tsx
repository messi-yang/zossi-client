import { useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import useWindowSize from '@/ui/hooks/useWindowSize';
import useOnHistoryChange from '@/ui/hooks/useOnHistoryChange';
import GameContext from '@/ui/contexts/GameContext';
import { MapRangeVo, LocationVo, MapSizeVo } from '@/models/valueObjects';
import GameSideBar from '@/ui/components/sidebars/GameSideBar';
import UnitMap from '@/ui/components/maps/UnitMap';
import GameMiniMap from '@/ui/components/maps/GameMiniMap';
import SelectItemModal from '@/ui/components/modals/SelectItemModal';
import { ItemAgg } from '@/models/aggregates';
import useDomRect from '@/ui/hooks/useDomRect';
import ConfirmModal from '@/ui/components/modals/ConfirmModal';

const Room: NextPage = function Room() {
  const windowSize = useWindowSize();
  const router = useRouter();
  const {
    mapSize,
    observedMapRange,
    unitMap,
    items,
    gameStatus,
    joinGame,
    leaveGame,
    buildItem,
    destroyItem,
    observeMapRange,
  } = useContext(GameContext);
  const [unitSize] = useState(50);
  const [isReconnectModalVisible, setIsReconnectModalVisible] = useState<boolean>(false);
  const [isMiniMapVisible, setIsMiniMapVisible] = useState<boolean>(false);
  const [isSelectItemModalVisible, setIsSelectItemModalVisible] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ItemAgg | null>(null);
  const isBuildindItem = !!selectedItem;
  const isDestroyingItem = !isBuildindItem;

  const [targetMapRange, setTargetMapRange] = useState<MapRangeVo | null>(observedMapRange);
  const observedMapRangeOffset = useMemo(() => {
    if (!observedMapRange || !targetMapRange) {
      return null;
    }
    return observedMapRange.calculateOffsetWithMapRange(targetMapRange);
  }, [observedMapRange, targetMapRange]);

  const [unitMapWrapperElemRef, unitMapWrapperElemRect] = useDomRect();
  const desiredMapSize = useMemo(() => {
    if (!unitMapWrapperElemRect) {
      return null;
    }

    return MapSizeVo.newWithResolutionAndUnitSize(
      { width: unitMapWrapperElemRect.width, height: unitMapWrapperElemRect.height },
      unitSize
    );
  }, [unitMapWrapperElemRect]);
  useEffect(
    function handleDesiredMapSizeUpdateEffect() {
      if (!desiredMapSize) {
        return;
      }
      const newMapRange = MapRangeVo.newWithLocationAndMapSize(
        observedMapRange ? observedMapRange.getFrom() : LocationVo.new(0, 0),
        desiredMapSize
      );
      setTargetMapRange(newMapRange);
      observeMapRange(newMapRange);
    },
    [observedMapRange === null, desiredMapSize, observeMapRange]
  );

  useEffect(function joinGameOnInitializationEffect() {
    joinGame();
  }, []);

  useEffect(
    function handleItemsRead() {
      setSelectedItem(items?.[0] || null);
    },
    [items]
  );

  const handleRouterLeave = useCallback(() => {
    leaveGame();
  }, [leaveGame]);
  useOnHistoryChange(handleRouterLeave);

  const handleLogoClick = () => {
    router.push('/');
  };

  const handleMiniMapMapRangeUpdate = (newMapRange: MapRangeVo) => {
    setTargetMapRange(newMapRange);
    observeMapRange(newMapRange);
  };

  const handleMiniMapClick = () => {
    setIsMiniMapVisible(!isMiniMapVisible);
  };

  const handleBuildItemClick = () => {
    setIsSelectItemModalVisible(true);
  };

  const handleDestroyClick = () => {
    setSelectedItem(null);
  };

  const handleSelectItemDone = () => {
    setIsSelectItemModalVisible(false);
  };

  const handleItemSelect = (item: ItemAgg) => {
    setSelectedItem(item);
  };

  useEffect(
    function onDisconnectEffect() {
      if (gameStatus === 'DISCONNECTED') {
        setIsReconnectModalVisible(true);
      }
    },
    [gameStatus]
  );

  const handleRecconectModalConfirmClick = useCallback(() => {
    window.location.reload();
  }, [joinGame]);

  const handleUnitClick = useCallback(
    (location: LocationVo) => {
      if (isDestroyingItem) {
        destroyItem(location);
      } else if (isBuildindItem) {
        if (!selectedItem) {
          return;
        }

        buildItem(location, selectedItem.getId());
      }
    },
    [isDestroyingItem, isBuildindItem, selectedItem, buildItem, destroyItem]
  );

  const screenSize: 'large' | 'small' = windowSize.width > 700 ? 'large' : 'small';

  return (
    <>
      {screenSize === 'large' && (
        <main className="flex" style={{ width: windowSize.width, height: windowSize.height }}>
          <ConfirmModal
            opened={isReconnectModalVisible}
            buttonCopy="Reconnect"
            onComfirm={handleRecconectModalConfirmClick}
          />
          <SelectItemModal
            opened={isSelectItemModalVisible}
            width={560}
            selectedItem={selectedItem}
            items={items || []}
            onSelect={handleItemSelect}
            onDone={handleSelectItemDone}
          />
          <section className="shrink-0">
            <GameSideBar
              align="column"
              onLogoClick={handleLogoClick}
              isBuildItemActive={isBuildindItem}
              onBuildItemClick={handleBuildItemClick}
              isDestroyActive={isDestroyingItem}
              onDestroyClick={handleDestroyClick}
              isMiniMapActive={isMiniMapVisible}
              onMiniMapClick={handleMiniMapClick}
            />
          </section>
          <section className="relative grow overflow-hidden bg-black">
            <section ref={unitMapWrapperElemRef} className="w-full h-full">
              <UnitMap
                mapRange={observedMapRange}
                mapRangeOffset={observedMapRangeOffset}
                unitMap={unitMap}
                unitSize={unitSize}
                items={items}
                selectedItemId={selectedItem?.getId() || null}
                onUnitClick={handleUnitClick}
              />
            </section>
            {mapSize && targetMapRange && isMiniMapVisible && (
              <section className="absolute right-5 bottom-5 opacity-80 inline-flex">
                <GameMiniMap
                  width={300}
                  mapSize={mapSize}
                  mapRange={targetMapRange}
                  onMapRangeUpdate={handleMiniMapMapRangeUpdate}
                />
              </section>
            )}
          </section>
        </main>
      )}
      {screenSize === 'small' && (
        <main className="flex flex-col" style={{ width: windowSize.width, height: windowSize.height }}>
          <ConfirmModal
            opened={isReconnectModalVisible}
            buttonCopy="Reconnect"
            onComfirm={handleRecconectModalConfirmClick}
          />
          <SelectItemModal
            opened={isSelectItemModalVisible}
            width={windowSize.width}
            selectedItem={selectedItem}
            items={items}
            onSelect={handleItemSelect}
            onDone={handleSelectItemDone}
          />
          <section className="relative grow overflow-hidden bg-black">
            <section ref={unitMapWrapperElemRef} className="w-full h-full">
              <UnitMap
                mapRange={observedMapRange}
                mapRangeOffset={observedMapRangeOffset}
                unitMap={unitMap}
                unitSize={unitSize}
                items={items || []}
                selectedItemId={selectedItem?.getId() || null}
                onUnitClick={handleUnitClick}
              />
            </section>
            {mapSize && targetMapRange && isMiniMapVisible && (
              <section className="absolute left-1/2 bottom-5 opacity-80 inline-flex translate-x-[-50%]">
                <GameMiniMap
                  width={windowSize.width * 0.8}
                  mapSize={mapSize}
                  mapRange={targetMapRange}
                  onMapRangeUpdate={handleMiniMapMapRangeUpdate}
                />
              </section>
            )}
          </section>
          <section className="shrink-0">
            <GameSideBar
              align="row"
              onLogoClick={handleLogoClick}
              isBuildItemActive={isBuildindItem}
              onBuildItemClick={handleBuildItemClick}
              isDestroyActive={isDestroyingItem}
              onDestroyClick={handleDestroyClick}
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
