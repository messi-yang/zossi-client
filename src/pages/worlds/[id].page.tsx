import { useEffect, useCallback, useRef, KeyboardEventHandler, useContext, useState } from 'react';
import type { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { useKeyPress } from '@/hooks/use-key-press';
import { WorldJourneyContext } from '@/contexts/world-journey-context';
import { DirectionModel } from '@/models/world/direction-model';
import { WorldCanvas } from '@/components/canvas/world-canvas';
import { MessageModal } from '@/components/modals/message-modal';
import { SelectItemsBar } from '@/components/bars/select-items-bar';
import { Text } from '@/components/texts/text';
import { AuthContext } from '@/contexts/auth-context';
import { WorldMembersContext } from '@/contexts/world-members-context';
import { Button } from '@/components/buttons/button';
import { ShareWorldModal } from '@/components/modals/share-world-modal';
import { ItemModel } from '@/models/world/item-model';

const Page: NextPage = function Page() {
  const router = useRouter();
  const worldId = router.query.id as string | null;

  const [isShareWorldModalVisible, setIsShareWorldModalVisible] = useState(false);
  const handleShareClick = useCallback(() => {
    setIsShareWorldModalVisible(true);
  }, []);
  const handleShareWorldModalClose = useCallback(() => {
    setIsShareWorldModalVisible(false);
  }, []);

  const { isSingedIn } = useContext(AuthContext);
  const { worldMembers, getWorldMembers } = useContext(WorldMembersContext);
  useEffect(() => {
    if (!isSingedIn || !worldId) return;

    getWorldMembers(worldId);
  }, [isSingedIn, worldId, getWorldMembers]);

  const mapContainerRef = useRef<HTMLElement | null>(null);
  const {
    worldJourney,
    connectionStatus,
    items,
    move,
    enterWorld,
    leaveWorld,
    changeHeldItem,
    createUnit,
    removeUnit,
    rotateUnit,
  } = useContext(WorldJourneyContext);

  const [myPlayerHeldItemId, setMyPlayerHeldItemId] = useState<string | null>(null);
  const [myPlayerPosText, setMyPlayerPosText] = useState<string | null>(null);
  useEffect(() => {
    if (!worldJourney) return () => {};

    return worldJourney.subscribeMyPlayerChanged((myPlayer) => {
      setMyPlayerHeldItemId(myPlayer.getHeldItemId());
      setMyPlayerPosText(myPlayer.getPosition().getPositionText());
    });
  }, [worldJourney]);

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
    const targetItemIdIndex = items.findIndex((item) => item.getId() === myPlayerHeldItemId) + 1;
    changeHeldItem(items[targetItemIdIndex % items.length]);
  }, [items, myPlayerHeldItemId]);

  const handleEqualClick = useCallback(() => {
    worldJourney?.addPerspectiveDepth();
  }, [worldJourney]);

  const handleMinusClick = useCallback(() => {
    worldJourney?.subtractPerspectiveDepth();
  }, [worldJourney]);

  useKeyPress('KeyP', { onKeyDown: createUnit });
  useKeyPress('KeyO', { onKeyDown: removeUnit });
  useKeyPress('KeyR', { onKeyDown: rotateUnit });
  useKeyPress('Space', { onKeyDown: switchToNextItem });
  useKeyPress('Equal', { onKeyDown: handleEqualClick });
  useKeyPress('Minus', { onKeyDown: handleMinusClick });

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

  const goToDashboardWorldsPage = () => {
    router.push('/dashboard/worlds');
  };
  const handleLogoClick = () => {
    goToDashboardWorldsPage();
  };
  const handleLogoKeyDown: KeyboardEventHandler<HTMLElement> = (evt) => {
    if (evt.code === 'Enter') {
      goToDashboardWorldsPage();
    }
  };

  const handleItemSelect = (item: ItemModel) => {
    changeHeldItem(item);
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
      {worldJourney && (
        <ShareWorldModal
          opened={isShareWorldModalVisible}
          world={worldJourney.getWorld()}
          worldMembes={worldMembers}
          onClose={handleShareWorldModalClose}
        />
      )}
      <div className="absolute top-2 right-3 z-10 flex items-center">
        <Button text="Share" onClick={handleShareClick} />
        <div className="ml-3 w-24 flex justify-center">
          <Text size="text-xl" color="text-white">
            {myPlayerPosText}
          </Text>
        </div>
      </div>
      <section className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10">
        <SelectItemsBar items={items} selectedItemId={myPlayerHeldItemId} onSelect={handleItemSelect} />
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
        <section className="w-full h-full">{worldJourney && <WorldCanvas worldJourney={worldJourney} />}</section>
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
