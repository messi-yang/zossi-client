import { useContext, useEffect, useCallback, useRef, KeyboardEventHandler } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import useOnHistoryChange from '@/hooks/useOnHistoryChange';
import useKeyPress from '@/hooks/useKeyPress';
import GameContext from '@/contexts/GameContext';
import ItemContext from '@/contexts/ItemContext';
import StyleContext from '@/contexts/StyleContext';
import { DirectionVo } from '@/models/valueObjects';
import GameCanvas from '@/components/canvas/GameCanvas';
import { ItemAgg } from '@/models/aggregates';
import ConfirmModal from '@/components/modals/ConfirmModal';
import SelectItemsBar from '@/components/bars/SelectItemsBar';
import SmallLogo from '@/components/logos/SmallLogo';

const Room: NextPage = function Room() {
  const router = useRouter();
  const gameId = router.query.id as string | null;
  const styleContext = useContext(StyleContext);
  const mapContainerRef = useRef<HTMLElement | null>(null);
  const {
    units,
    myPlayer,
    otherPlayers,
    visionBound,
    gameStatus,
    joinGame,
    move,
    leaveGame,
    changeHeldItem,
    placeItem,
    destroyItem,
  } = useContext(GameContext);
  const { items } = useContext(ItemContext);
  const heldItemId = myPlayer?.getHeldItemid() || null;
  const isReconnectModalVisible = gameStatus === 'DISCONNECTED';

  const switchToNextItem = useCallback(() => {
    if (!items) {
      return;
    }
    const targetItemIdIndex = items.findIndex((item) => item.getId() === heldItemId) + 1;
    changeHeldItem(items[targetItemIdIndex % items.length].getId());
  }, [items, heldItemId]);

  useKeyPress('KeyP', { onKeyDown: placeItem });
  useKeyPress('KeyO', { onKeyDown: destroyItem });
  useKeyPress('Space', { onKeyDown: switchToNextItem });

  const isUpPressed = useKeyPress('KeyW');
  const isRightPressed = useKeyPress('KeyD');
  const isDownPressed = useKeyPress('KeyS');
  const isLeftPressed = useKeyPress('KeyA');
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
        if (isUpPressed) move(DirectionVo.newUp());
        if (isRightPressed) move(DirectionVo.newRight());
        if (isDownPressed) move(DirectionVo.newDown());
        if (isLeftPressed) move(DirectionVo.newLeft());
      };

      doMove();
      const goUpInterval = setInterval(doMove, 100);

      return () => {
        clearInterval(goUpInterval);
      };
    },
    [isUpPressed, isRightPressed, isDownPressed, isLeftPressed, move]
  );

  useEffect(
    function joinGameOnInitEffect() {
      if (gameId) {
        joinGame(gameId);
      }
    },
    [gameId]
  );

  const handleRouterLeave = useCallback(() => {
    leaveGame();
  }, [leaveGame]);
  useOnHistoryChange(handleRouterLeave);

  const goToLandingPage = () => {
    router.push('/');
  };
  const handleLogoClick = () => {
    goToLandingPage();
  };
  const handleLogoKeyDown: KeyboardEventHandler<HTMLElement> = (evt) => {
    if (evt.code === 'Enter') {
      goToLandingPage();
    }
  };

  const handleItemSelect = (item: ItemAgg) => {
    changeHeldItem(item.getId());
  };

  const handleRecconectModalConfirmClick = useCallback(() => {
    window.location.reload();
  }, []);

  return (
    <main
      className="relative w-screen h-screen flex"
      style={{ width: styleContext.windowWidth, height: styleContext.windowHeight }}
    >
      <ConfirmModal
        opened={isReconnectModalVisible}
        buttonCopy="Reconnect"
        onComfirm={handleRecconectModalConfirmClick}
      />
      <section className="absolute bottom-2 left-1/2 translate-x-[-50%] z-10">
        <SelectItemsBar items={items} selectedItemId={heldItemId} onSelect={handleItemSelect} />
      </section>
      <section
        className="absolute top-2 left-2 z-10 bg-black p-2 rounded-lg"
        role="button"
        tabIndex={0}
        onClick={handleLogoClick}
        onKeyDown={handleLogoKeyDown}
      >
        <SmallLogo />
      </section>
      <section ref={mapContainerRef} className="relative grow overflow-hidden bg-black">
        <section className="w-full h-full">
          {myPlayer && otherPlayers && units && items && visionBound && (
            <GameCanvas
              otherPlayers={otherPlayers}
              myPlayer={myPlayer}
              units={units}
              items={items}
              visionBound={visionBound}
            />
          )}
        </section>
      </section>
    </main>
  );
};

export default Room;
