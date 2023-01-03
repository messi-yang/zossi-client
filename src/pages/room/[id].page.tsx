import { useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import useWindowSize from '@/ui/hooks/useWindowSize';
import GameContext from '@/ui/contexts/GameContext';
import { MapRangeVo, LocationVo, MapSizeVo, OffsetVo } from '@/models/valueObjects';
import GameSideBar from '@/ui/components/sidebars/GameSideBar';
import GameMap from '@/ui/components/maps/GameMap';
import GameMiniMap from '@/ui/components/maps/GameMiniMap';
import SelectItemModal from '@/ui/components/modals/SelectItemModal';
import { ItemAgg } from '@/models/aggregates';
import useDomRect from '@/ui/hooks/useDomRect';

const Room: NextPage = function Room() {
  const windowSize = useWindowSize();
  const router = useRouter();
  const {
    mapSize,
    zoomedMapRange,
    gameMap,
    items,
    gameStatus,
    joinGame,
    leaveGame,
    buildItem,
    destroyItem,
    zoomMapRange,
  } = useContext(GameContext);
  const [isMiniMapVisible, setIsMiniMapVisible] = useState<boolean>(false);
  const [isSelectItemModalVisible, setIsSelectItemModalVisible] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ItemAgg | null>(null);
  const isBuildindItem = !!selectedItem;
  const isDestroyingItem = !isBuildindItem;

  const [targetMapRange, setTargetMapRange] = useState<MapRangeVo | null>(zoomedMapRange);
  const zoomedMapRangeOffset = useMemo(() => {
    if (!zoomedMapRange || !targetMapRange) {
      return OffsetVo.new(0, 0);
    }
    return zoomedMapRange.calculateOffsetWithMapRange(targetMapRange);
  }, [zoomedMapRange, targetMapRange]);

  const [gameMapWrapperElemRef, gameMapWrapperElemRect] = useDomRect();
  const desiredMapSize = useMemo(() => {
    if (!gameMapWrapperElemRect) {
      return null;
    }

    return MapSizeVo.newWithResolutionAndMapUnitSize(
      { width: gameMapWrapperElemRect.width, height: gameMapWrapperElemRect.height },
      30
    );
  }, [gameMapWrapperElemRect]);
  useEffect(
    function handleDesiredMapSizeUpdateEffect() {
      if (gameStatus === 'OPEN') {
        return;
      }
      if (!desiredMapSize) {
        return;
      }
      const newMapRange = MapRangeVo.newWithLocationAndMapSize(
        targetMapRange ? targetMapRange.getFrom() : LocationVo.new(0, 0),
        desiredMapSize
      );
      setTargetMapRange(newMapRange);
      zoomMapRange(newMapRange);
    },
    [targetMapRange, desiredMapSize, gameStatus]
  );

  const deviceSize: 'large' | 'small' = windowSize.width > 700 ? 'large' : 'small';
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
    function joinGameOnInitializationEffect() {
      joinGame();

      return () => {
        leaveGame();
      };
    },
    [leaveGame]
  );

  const handleLogoClick = () => {
    router.push('/');
  };

  const handleMiniMapMapRangeUpdate = (newMapRange: MapRangeVo) => {
    setTargetMapRange(newMapRange);
    zoomMapRange(newMapRange);
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

  const handleMapUnitClick = useCallback(
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
            <section ref={gameMapWrapperElemRef} className="w-full h-full">
              <GameMap
                mapRange={zoomedMapRange}
                mapRangeOffset={zoomedMapRangeOffset}
                gameMap={gameMap}
                onMapUnitClick={handleMapUnitClick}
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
            <section ref={gameMapWrapperElemRef} className="w-full h-full">
              <GameMap
                mapRange={zoomedMapRange}
                mapRangeOffset={zoomedMapRangeOffset}
                gameMap={gameMap}
                onMapUnitClick={handleMapUnitClick}
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
