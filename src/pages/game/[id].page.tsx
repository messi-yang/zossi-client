import { useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import useOnHistoryChange from '@/hooks/useOnHistoryChange';
import useKeyPress from '@/hooks/useKeyPress';
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

  useKeyPress('p', {
    onKeyDown: () => {
      if (selectedItemId) placeItem(selectedItemId);
    },
  });
  useKeyPress('o', { onKeyDown: destroyItem });

  const isUpPressed = useKeyPress('w');
  const isRightPressed = useKeyPress('d');
  const isDownPressed = useKeyPress('s');
  const isLeftPressed = useKeyPress('a');
  useEffect(
    function () {
      let pressedKeysCount = 0;
      if (isUpPressed) pressedKeysCount += 1;
      if (isRightPressed) pressedKeysCount += 1;
      if (isDownPressed) pressedKeysCount += 1;
      if (isLeftPressed) pressedKeysCount += 1;
      if (pressedKeysCount !== 1) {
        return () => {};
      }

      const doMove = () => {
        if (isUpPressed) move(DirectionVo.new(0));
        if (isRightPressed) move(DirectionVo.new(1));
        if (isDownPressed) move(DirectionVo.new(2));
        if (isLeftPressed) move(DirectionVo.new(3));
      };

      doMove();
      const goUpInterval = setInterval(doMove, 100);

      return () => {
        clearInterval(goUpInterval);
      };
    },
    [isUpPressed, isRightPressed, isDownPressed, isLeftPressed, move]
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
  }, []);

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
            />
          </section>
          <section ref={mapContainerRef} className="relative grow overflow-hidden bg-black">
            <section className="w-full h-full">
              {myPlayer && players && units && items && (
                <GameCanvas players={players} cameraPosition={myPlayer.getPosition()} units={units} items={items} />
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
                <GameCanvas players={players} cameraPosition={myPlayer.getPosition()} units={units} items={items} />
              )}
            </section>
          </section>
          <section className="shrink-0">
            <GameSideBar
              align="row"
              onLogoClick={handleLogoClick}
              isPlaceItemActive={isBuildindItem}
              onPlaceItemClick={handlePlaceItemClick}
            />
          </section>
        </main>
      )}
    </>
  );
};

export default Room;
