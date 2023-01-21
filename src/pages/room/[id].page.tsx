import { useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import useOnHistoryChange from '@/hooks/useOnHistoryChange';
import useDomRect from '@/hooks/useDomRect';
import GameContext from '@/contexts/GameContext';
import StyleContext from '@/contexts/StyleContext';
import { LocationVo, SizeVo, CameraVo } from '@/models/valueObjects';
import GameSideBar from '@/components/sidebars/GameSideBar';
import Map from '@/components/maps/Map';
import GameMiniMap from '@/components/maps/GameMiniMap';
import SelectItemModal from '@/components/modals/SelectItemModal';
import { ItemAgg } from '@/models/aggregates';
import ConfirmModal from '@/components/modals/ConfirmModal';

const Room: NextPage = function Room() {
  const router = useRouter();
  const styleContext = useContext(StyleContext);
  const mapContainerRef = useRef<HTMLElement | null>(null);
  const mapContainerRect = useDomRect(mapContainerRef);
  const clientViewBoundSize = useMemo(() => {
    if (!mapContainerRect) {
      return null;
    }
    return SizeVo.newWithResolutionAndUnitSize(
      {
        width: mapContainerRect.width,
        height: mapContainerRect.height,
      },
      50
    );
  }, [mapContainerRect]);
  const { mapSize, view, items, player, gameStatus, joinGame, leaveGame, buildItem, destroyItem, changeCamera } =
    useContext(GameContext);
  const [unitSize] = useState(50);
  const [isReconnectModalVisible, setIsReconnectModalVisible] = useState<boolean>(false);
  const [isMiniMapVisible, setIsMiniMapVisible] = useState<boolean>(false);
  const [isSelectItemModalVisible, setIsSelectItemModalVisible] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ItemAgg | null>(null);
  const isBuildindItem = !!selectedItem;
  const isDestroyingItem = !isBuildindItem;

  const [targetCamera, setTargetCamera] = useState<CameraVo | null>(null);
  const clientViewBound = useMemo(() => {
    if (!targetCamera || !mapSize || !clientViewBoundSize) {
      return null;
    }
    return targetCamera.getViewBoundInMap(mapSize, clientViewBoundSize);
  }, [targetCamera, mapSize, clientViewBoundSize]);

  const viewOffset = useMemo(() => {
    if (!view || !clientViewBound) {
      return null;
    }
    return view.getBound().calculateOffsetWithBound(clientViewBound);
  }, [view, clientViewBound]);

  useEffect(
    function initTargetCameraWithPlayerEffect() {
      if (player && !targetCamera) {
        setTargetCamera(player.getCamera());
      }
    },
    [player, targetCamera]
  );

  useEffect(function joinGameOnInitEffect() {
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

  const handleMiniMapDrag = (location: LocationVo) => {
    const newCamera = CameraVo.new(location);
    changeCamera(newCamera);
    setTargetCamera(newCamera);
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
          <section ref={mapContainerRef} className="relative grow overflow-hidden bg-black">
            <section className="w-full h-full">
              <Map
                view={view}
                viewOffset={viewOffset}
                unitSize={unitSize}
                items={items}
                selectedItemId={selectedItem?.getId() || null}
                onUnitClick={handleUnitClick}
              />
            </section>
            {mapSize && clientViewBound && isMiniMapVisible && (
              <section className="absolute right-5 bottom-5 opacity-80 inline-flex">
                <GameMiniMap width={300} mapSize={mapSize} bound={clientViewBound} onDrag={handleMiniMapDrag} />
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
          <section ref={mapContainerRef} className="relative grow overflow-hidden bg-black">
            <section className="w-full h-full">
              <Map
                view={view}
                viewOffset={viewOffset}
                unitSize={unitSize}
                items={items}
                selectedItemId={selectedItem?.getId() || null}
                onUnitClick={handleUnitClick}
              />
            </section>
            {mapSize && clientViewBound && isMiniMapVisible && (
              <section className="absolute left-1/2 bottom-5 opacity-80 inline-flex translate-x-[-50%]">
                <GameMiniMap
                  width={styleContext.getWindowWidth() * 0.8}
                  mapSize={mapSize}
                  bound={clientViewBound}
                  onDrag={handleMiniMapDrag}
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
