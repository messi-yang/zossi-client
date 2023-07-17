import { useContext, useEffect, useCallback, useRef, KeyboardEventHandler } from 'react';
import type { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { useKeyPress } from '@/hooks/use-key-press';
import { WorldJourneyContext } from '@/contexts/world-journey-context';
import { DirectionModel, ItemModel } from '@/models';
import { WorldCanvas } from '@/components/canvas/world-canvas';
import { MessageModal } from '@/components/modals/message-modal';
import { SelectItemsBar } from '@/components/bars/select-items-bar';
import { Text } from '@/components/texts/text';

const Page: NextPage = function Page() {
  const router = useRouter();
  const worldId = router.query.id as string | null;
  const mapContainerRef = useRef<HTMLElement | null>(null);
  const {
    units,
    world,
    myPlayer,
    otherPlayers,
    cameraDistance,
    connectionStatus,
    items,
    move,
    enterWorld,
    leaveWorld,
    changeHeldItem,
    createUnit,
    removeUnit,
    addCameraDistance,
    subtractCameraDistance,
  } = useContext(WorldJourneyContext);

  const heldItemId = myPlayer?.getHeldItemid() || null;
  const isReconnectModalVisible = connectionStatus === 'DISCONNECTED';

  useEffect(
    function enterWorldOnInit() {
      if (!worldId) {
        return () => {};
      }
      enterWorld(worldId);
      return () => {
        leaveWorld();
      };
    },
    [worldId]
  );

  const switchToNextItem = useCallback(() => {
    if (!items) {
      return;
    }
    const targetItemIdIndex = items.findIndex((item) => item.getId() === heldItemId) + 1;
    changeHeldItem(items[targetItemIdIndex % items.length].getId());
  }, [items, heldItemId]);

  useKeyPress('KeyP', { onKeyDown: createUnit });
  useKeyPress('KeyO', { onKeyDown: removeUnit });
  useKeyPress('Space', { onKeyDown: switchToNextItem });
  useKeyPress('Equal', { onKeyDown: addCameraDistance });
  useKeyPress('Minus', { onKeyDown: subtractCameraDistance });

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
        if (isUpPressed) move(DirectionModel.newUp());
        if (isRightPressed) move(DirectionModel.newRight());
        if (isDownPressed) move(DirectionModel.newDown());
        if (isLeftPressed) move(DirectionModel.newLeft());
      };

      doMove();
      const goUpInterval = setInterval(doMove, 100);

      return () => {
        clearInterval(goUpInterval);
      };
    },
    [isUpPressed, isRightPressed, isDownPressed, isLeftPressed, move]
  );

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

  const handleItemSelect = (item: ItemModel) => {
    changeHeldItem(item.getId());
  };

  const handleRecconectModalConfirmClick = useCallback(() => {
    if (worldId) {
      enterWorld(worldId);
    }
  }, [enterWorld, worldId]);

  return (
    <main className="relative w-full h-screen">
      <MessageModal
        opened={isReconnectModalVisible}
        message="You're disconnected to the world."
        buttonCopy="Reconnect"
        onComfirm={handleRecconectModalConfirmClick}
      />
      <div className="absolute top-2 right-3 z-10 flex">
        <Text size="text-xl" color="text-white">
          {myPlayer?.getPositionText() || null}
        </Text>
      </div>
      <section className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10">
        <SelectItemsBar items={items} selectedItemId={heldItemId} onSelect={handleItemSelect} />
      </section>
      <section
        className="absolute top-2 left-2 z-10 bg-black p-2 rounded-lg"
        role="button"
        tabIndex={0}
        onClick={handleLogoClick}
        onKeyDown={handleLogoKeyDown}
      >
        <Image src="/assets/images/logos/small-logo.png" alt="small logo" width={28} height={28} />
      </section>
      <section ref={mapContainerRef} className="relative w-full h-full overflow-hidden bg-black">
        <section className="w-full h-full">
          {world && myPlayer && otherPlayers && units && items && (
            <WorldCanvas
              cameraDistance={cameraDistance}
              world={world}
              otherPlayers={otherPlayers}
              myPlayer={myPlayer}
              units={units}
              items={items}
            />
          )}
        </section>
      </section>
    </main>
  );
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: true,
});

export const getStaticProps: GetStaticProps = async () => ({
  props: {},
});

export default Page;
