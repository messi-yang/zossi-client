import { useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import useOnHistoryChange from '@/ui/hooks/useOnHistoryChange';
import useOnWindowResize from '@/ui/hooks/useOnWindowResize';
import GameContext from '@/ui/contexts/GameContext';
import StyleContext from '@/ui/contexts/StyleContext';
import { RangeVo, LocationVo, MapSizeVo } from '@/models/valueObjects';
import GameSideBar from '@/ui/components/sidebars/GameSideBar';
import Map from '@/ui/components/maps/Map';
import GameMiniMap from '@/ui/components/maps/GameMiniMap';
import SelectItemModal from '@/ui/components/modals/SelectItemModal';
import { ItemAgg } from '@/models/aggregates';
import ConfirmModal from '@/ui/components/modals/ConfirmModal';

const Room: NextPage = function Room() {
  const router = useRouter();
  const styleContext = useContext(StyleContext);
  const { mapSize, observedRange, map, items, gameStatus, joinGame, leaveGame, buildItem, destroyItem, observeRange } =
    useContext(GameContext);
  const [unitSize] = useState(50);
  const [isReconnectModalVisible, setIsReconnectModalVisible] = useState<boolean>(false);
  const [isMiniMapVisible, setIsMiniMapVisible] = useState<boolean>(false);
  const [isSelectItemModalVisible, setIsSelectItemModalVisible] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ItemAgg | null>(null);
  const isBuildindItem = !!selectedItem;
  const isDestroyingItem = !isBuildindItem;

  const [targetRange, setTargetRange] = useState<RangeVo | null>(null);
  const observedRangeOffset = useMemo(() => {
    if (!observedRange || !targetRange) {
      return null;
    }
    return observedRange.calculateOffsetWithRange(targetRange);
  }, [observedRange, targetRange]);

  useEffect(
    function handleWindowSizeIsReadyEffect() {
      if (!styleContext.isWindowSizeReady) {
        return;
      }
      setTargetRange(
        RangeVo.newWithLocationAndMapSize(
          LocationVo.new(0, 0),
          MapSizeVo.newWithResolutionAndUnitSize(
            {
              width: styleContext.getWindowWidth(),
              height: styleContext.getWindowWidth(),
            },
            30
          )
        )
      );
    },
    [styleContext.isWindowSizeReady]
  );

  const handleDesiredMapSizeUpdate = useCallback(() => {
    const newRange = RangeVo.newWithLocationAndMapSize(
      observedRange ? observedRange.getFrom() : LocationVo.new(0, 0),
      MapSizeVo.newWithResolutionAndUnitSize(
        {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        30
      )
    );
    setTargetRange(newRange);
    observeRange(newRange);
  }, [observedRange === null, observeRange]);
  useOnWindowResize(handleDesiredMapSizeUpdate);

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

  const handleMiniMapRangeUpdate = (newRange: RangeVo) => {
    setTargetRange(newRange);
    observeRange(newRange);
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

  const screenSize: 'large' | 'small' = styleContext.getWindowWidth() > 700 ? 'large' : 'small';

  return (
    <>
      {screenSize === 'large' && (
        <main
          className="w-screen h-screen flex"
          style={{ width: styleContext.windowWidth, height: styleContext.windowHeight }}
        >
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
            <section className="w-full h-full">
              <Map
                range={observedRange}
                rangeOffset={observedRangeOffset}
                map={map}
                unitSize={unitSize}
                items={items}
                selectedItemId={selectedItem?.getId() || null}
                onUnitClick={handleUnitClick}
              />
            </section>
            {mapSize && targetRange && isMiniMapVisible && (
              <section className="absolute right-5 bottom-5 opacity-80 inline-flex">
                <GameMiniMap
                  width={300}
                  mapSize={mapSize}
                  range={targetRange}
                  onRangeUpdate={handleMiniMapRangeUpdate}
                />
              </section>
            )}
          </section>
        </main>
      )}
      {screenSize === 'small' && (
        <main
          className="w-screen h-screen flex flex-col"
          style={{ width: styleContext.windowWidth, height: styleContext.windowHeight }}
        >
          <ConfirmModal
            opened={isReconnectModalVisible}
            buttonCopy="Reconnect"
            onComfirm={handleRecconectModalConfirmClick}
          />
          <SelectItemModal
            opened={isSelectItemModalVisible}
            width={styleContext.getWindowWidth()}
            selectedItem={selectedItem}
            items={items}
            onSelect={handleItemSelect}
            onDone={handleSelectItemDone}
          />
          <section className="relative grow overflow-hidden bg-black">
            <section className="w-full h-full">
              <Map
                range={observedRange}
                rangeOffset={observedRangeOffset}
                map={map}
                unitSize={unitSize}
                items={items || []}
                selectedItemId={selectedItem?.getId() || null}
                onUnitClick={handleUnitClick}
              />
            </section>
            {mapSize && targetRange && isMiniMapVisible && (
              <section className="absolute left-1/2 bottom-5 opacity-80 inline-flex translate-x-[-50%]">
                <GameMiniMap
                  width={styleContext.getWindowWidth() * 0.8}
                  mapSize={mapSize}
                  range={targetRange}
                  onRangeUpdate={handleMiniMapRangeUpdate}
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
