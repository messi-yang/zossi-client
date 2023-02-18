import { useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useHotkeys } from 'react-hotkeys-hook';
import useOnHistoryChange from '@/hooks/useOnHistoryChange';
import GameContext from '@/contexts/GameContext';
import StyleContext from '@/contexts/StyleContext';
import { DirectionVo } from '@/models/valueObjects';
import GameCanvas from '@/components/canvas/GameCanvas';
import GameSideBar from '@/components/sidebars/GameSideBar';
import SelectItemModal from '@/components/modals/SelectItemModal';
import { ItemAgg } from '@/models/aggregates';
import ConfirmModal from '@/components/modals/ConfirmModal';

const Room: NextPage = function Room() {
  const router = useRouter();
  const styleContext = useContext(StyleContext);
  const mapContainerRef = useRef<HTMLElement | null>(null);
  const { units, items, myPlayer, players, gameStatus, joinGame, move, leaveGame, placeItem, destroyItem } =
    useContext(GameContext);
  const [isReconnectModalVisible, setIsReconnectModalVisible] = useState<boolean>(false);
  const [isSelectItemModalVisible, setIsSelectItemModalVisible] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<ItemAgg | null>(null);
  const selectedItemId = selectedItem?.getId() || null;
  const isBuildindItem = !!selectedItem;
  const isDestroyingItem = !isBuildindItem;

  useHotkeys(
    'w,a,s,d,p,o',
    (_, { keys }) => {
      if (!keys) {
        return;
      }
      switch (keys.join('')) {
        case 'w':
          move(DirectionVo.new(0));
          break;
        case 'd':
          move(DirectionVo.new(1));
          break;
        case 's':
          move(DirectionVo.new(2));
          break;
        case 'a':
          move(DirectionVo.new(3));
          break;
        case 'p':
          console.log(myPlayer?.getLocation().shift(1, 0), selectedItemId);
          if (!myPlayer || selectedItemId === null) break;
          placeItem(myPlayer.getLocation().shift(1, 0), selectedItemId);
          break;
        case 'o':
          if (!myPlayer) break;
          destroyItem(myPlayer.getLocation().shift(1, 0));
          break;
        default:
      }
    },
    [move, placeItem, destroyItem, myPlayer, selectedItemId]
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

  const handlePlaceItemClick = () => {
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
              isPlaceItemActive={isBuildindItem}
              onPlaceItemClick={handlePlaceItemClick}
              isDestroyActive={isDestroyingItem}
              onDestroyClick={handleDestroyClick}
            />
          </section>
          <section ref={mapContainerRef} className="relative grow overflow-hidden bg-black">
            <section className="w-full h-full">
              {myPlayer && players && units && items && (
                <GameCanvas
                  players={players}
                  cameraLocation={myPlayer.getLocation()}
                  units={units}
                  items={items}
                  selectedItemId={selectedItemId !== undefined ? selectedItemId : null}
                />
              )}
            </section>
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
              {myPlayer && players && units && items && (
                <GameCanvas
                  players={players}
                  cameraLocation={myPlayer.getLocation()}
                  units={units}
                  items={items}
                  selectedItemId={selectedItemId !== undefined ? selectedItemId : null}
                />
              )}
            </section>
          </section>
          <section className="shrink-0">
            <GameSideBar
              align="row"
              onLogoClick={handleLogoClick}
              isPlaceItemActive={isBuildindItem}
              onPlaceItemClick={handlePlaceItemClick}
              isDestroyActive={isDestroyingItem}
              onDestroyClick={handleDestroyClick}
            />
          </section>
        </main>
      )}
    </>
  );
};

export default Room;
