import { useEffect, useCallback, useRef, KeyboardEventHandler, useContext, useState } from 'react';
import type { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';

import { useHotKeys } from '@/hooks/use-hot-keys';
import { WorldJourneyServiceContext } from '@/contexts/world-journey-service-context';
import { DirectionVo } from '@/models/world/common/direction-vo';
import { WorldCanvas } from '@/components/canvas/world-canvas';
import { MessageModal } from '@/components/modals/message-modal';
import { SelectItemsBar } from '@/components/bars/select-items-bar';
import { Text } from '@/components/texts/text';
import { AuthContext } from '@/contexts/auth-context';
import { WorldMembersContext } from '@/contexts/world-members-context';
import { Button } from '@/components/buttons/button';
import { ShareWorldModal } from '@/components/modals/share-world-modal';
import { ItemModel } from '@/models/world/item/item-model';
import { EmbedModal } from '@/components/modals/embed-modal';
import { WorldJourneyServiceLoadTestContext } from '@/contexts/world-journey-load-test-context';

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

  const { startLoadTest, endLoadTest } = useContext(WorldJourneyServiceLoadTestContext);
  useEffect(() => {
    // @ts-expect-error
    window.startLoadTest = () => {
      // @ts-expect-error
      startLoadTest(worldId);
    };
    // @ts-expect-error
    window.endLoadTest = endLoadTest;

    return () => {
      // @ts-expect-error
      delete window.startLoadTest;
      // @ts-expect-error
      delete window.endLoadTest;
    };
  }, [worldId, startLoadTest, endLoadTest]);

  const mapContainerRef = useRef<HTMLElement | null>(null);
  const {
    worldJourneyService,
    connectionStatus,
    items,
    enterWorld,
    addPerspectiveDepth,
    subtractPerspectiveDepth,
    makePlayerStand,
    makePlayerWalk,
    leaveWorld,
    changePlayerHeldItem,
    engageUnit,
    createUnit,
    removeUnit,
    rotateUnit,
    embedCode,
    cleanEmbedCode,
  } = useContext(WorldJourneyServiceContext);

  const handleEngageUnitPressedKeysChange = useCallback(
    (keys: string[]) => {
      if (keys.length === 0) return;
      engageUnit();
    },
    [engageUnit]
  );
  useHotKeys(['KeyG'], { onPressedKeysChange: handleEngageUnitPressedKeysChange });

  const [myPlayerHeldItemId, setMyPlayerHeldItemId] = useState<string | null>(null);
  const [myPlayerPosText, setMyPlayerPosText] = useState<string | null>(null);
  useEffect(() => {
    if (!worldJourneyService) return () => {};

    return worldJourneyService.subscribe('PLAYER_UPDATED', ([, player]) => {
      if (!worldJourneyService.isMyPlayer(player)) return;

      setMyPlayerHeldItemId(player.getHeldItemId());
      setMyPlayerPosText(player.getPosition().toText());
    });
  }, [worldJourneyService]);

  const isDisconnected = connectionStatus === 'DISCONNECTED';
  useEffect(() => {
    if (!isDisconnected) return () => {};

    const timeout = setTimeout(() => {
      window.location.href = '/dashboard/worlds';
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [isDisconnected]);

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
    changePlayerHeldItem(items[targetItemIdIndex % items.length]);
  }, [items, myPlayerHeldItemId, changePlayerHeldItem]);

  const handleCreateUnitPressedKeysChange = useCallback(
    (keys: string[]) => {
      if (keys.length === 0) return;
      createUnit();
    },
    [createUnit]
  );
  useHotKeys(['KeyP'], { onPressedKeysChange: handleCreateUnitPressedKeysChange });

  const handleRemoveUnitPressedKeysChange = useCallback(
    (keys: string[]) => {
      if (keys.length === 0) return;
      removeUnit();
    },
    [removeUnit]
  );
  useHotKeys(['KeyO'], { onPressedKeysChange: handleRemoveUnitPressedKeysChange });

  const handleRotateUnitPressedKeysChange = useCallback(
    (keys: string[]) => {
      if (keys.length === 0) return;
      rotateUnit();
    },
    [rotateUnit]
  );
  useHotKeys(['KeyR'], { onPressedKeysChange: handleRotateUnitPressedKeysChange });

  const handleSwitchToNextItemPressedKeysChange = useCallback(
    (keys: string[]) => {
      if (keys.length === 0) return;
      switchToNextItem();
    },
    [switchToNextItem]
  );
  useHotKeys(['Space'], { onPressedKeysChange: handleSwitchToNextItemPressedKeysChange });

  const handleAddPerspectiveDepthPressedKeysChange = useCallback(
    (keys: string[]) => {
      if (keys.length === 0) return;
      addPerspectiveDepth();
    },
    [addPerspectiveDepth]
  );
  useHotKeys(['Equal'], { onPressedKeysChange: handleAddPerspectiveDepthPressedKeysChange });

  const handleSubtractPerspectiveDepthPressedKeysChange = useCallback(
    (keys: string[]) => {
      if (keys.length === 0) return;
      subtractPerspectiveDepth();
    },
    [subtractPerspectiveDepth]
  );
  useHotKeys(['Minus', 'KeyC'], { onPressedKeysChange: handleSubtractPerspectiveDepthPressedKeysChange });

  const handleMakePlayerWalkPressedKeysChange = useCallback(
    (keys: string[]) => {
      const lastKey = keys[keys.length - 1] || null;
      switch (lastKey) {
        case 'KeyW':
          makePlayerWalk(DirectionVo.newUp());
          break;
        case 'KeyD':
          makePlayerWalk(DirectionVo.newRight());
          break;
        case 'KeyS':
          makePlayerWalk(DirectionVo.newDown());
          break;
        case 'KeyA':
          makePlayerWalk(DirectionVo.newLeft());
          break;
        default:
          makePlayerStand();
      }
    },
    [makePlayerStand, makePlayerWalk]
  );
  useHotKeys(['KeyW', 'KeyD', 'KeyS', 'KeyA'], {
    onPressedKeysChange: handleMakePlayerWalkPressedKeysChange,
  });

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
    changePlayerHeldItem(item);
  };

  const handleRecconectModalConfirmClick = useCallback(() => {
    if (worldId) {
      enterWorld(worldId);
    }
  }, [enterWorld, worldId]);

  return (
    <main className="relative w-full h-screen">
      {embedCode && <EmbedModal opened embedCode={embedCode} onClose={cleanEmbedCode} />}
      <MessageModal
        opened={isDisconnected}
        message="You're disconnected to the world."
        buttonCopy="Reconnect"
        onComfirm={handleRecconectModalConfirmClick}
      />
      {worldJourneyService && (
        <ShareWorldModal
          opened={isShareWorldModalVisible}
          world={worldJourneyService.getWorld()}
          worldMembes={worldMembers}
          onClose={handleShareWorldModalClose}
        />
      )}
      <div className="absolute top-2 right-3 z-10 flex items-center">
        <Button text="Share" onClick={handleShareClick} />
        <div className="ml-3 w-24 flex justify-center">
          <Text size="text-xl">{myPlayerPosText}</Text>
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
        <section className="w-full h-full">
          {worldJourneyService && <WorldCanvas worldJourneyService={worldJourneyService} />}
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
