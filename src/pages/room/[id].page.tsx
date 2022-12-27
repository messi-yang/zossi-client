import { useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import useWindowSize from '@/ui/hooks/useWindowSize';
import GameContext from '@/ui/contexts/GameContext';
import { AreaVo, CoordinateVo } from '@/models/valueObjects';
import {
  calculateDimensionByResolutionAndUnitSideLength,
  createCoordinate,
  createAreaByCoordinateAndDimension,
} from '@/models/valueObjects/factories';
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
    dimension,
    zoomedArea,
    zoomedAreaOffset,
    targetArea,
    unitBlock,
    items,
    status,
    joinGame,
    leaveGame,
    buildItem,
    zoomArea,
  } = useContext(GameContext);
  const [isMiniMapVisible, setIsMiniMapVisible] = useState<boolean>(false);
  const [isSelectItemModalVisible, setIsSelectItemModalVisible] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ItemAgg | null>(null);
  const isBuildindItem = !!selectedItem;
  const isDestroyingItem = !isBuildindItem;

  const gameMapWrapperElemRef = useRef<HTMLElement>(null);
  const gameMapWrapperElemRect = useDomRect(gameMapWrapperElemRef);
  const desiredDimension = useMemo(
    () =>
      calculateDimensionByResolutionAndUnitSideLength(
        { width: gameMapWrapperElemRect.width, height: gameMapWrapperElemRect.height },
        30
      ),
    [gameMapWrapperElemRect]
  );
  useEffect(
    function handleDesiredDimensionUpdateEffect() {
      if (status !== 'OPEN') {
        return;
      }
      if (zoomedArea === null) {
        const newArea = createAreaByCoordinateAndDimension(createCoordinate(0, 0), desiredDimension);
        zoomArea(newArea);
      } else {
        const newArea = createAreaByCoordinateAndDimension(zoomedArea.getFrom(), desiredDimension);
        zoomArea(newArea);
      }
    },
    [zoomedArea === null, desiredDimension, status]
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

  const handleAreaUpdate = (newArea: AreaVo) => {
    zoomArea(newArea);
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

  const handleUnitClick = useCallback(
    (coordinate: CoordinateVo) => {
      if (!selectedItem) {
        return;
      }

      buildItem(coordinate, selectedItem.getId());
    },
    [selectedItem, buildItem]
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
                area={zoomedArea}
                areaOffset={zoomedAreaOffset}
                unitBlock={unitBlock}
                onUnitClick={handleUnitClick}
              />
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
            <section ref={gameMapWrapperElemRef} className="w-full h-full">
              <GameMap
                area={zoomedArea}
                areaOffset={zoomedAreaOffset}
                unitBlock={unitBlock}
                onUnitClick={handleUnitClick}
              />
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
