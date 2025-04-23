'use client';

import { useEffect, useCallback, useRef, KeyboardEventHandler, useContext, useState, use } from 'react';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { useHotKeys } from '@/hooks/use-hot-keys';
import { WorldJourneyServiceContext } from '@/contexts/world-journey-service-context';
import { DirectionVo } from '@/models/world/common/direction-vo';
import { WorldCanvas } from '@/components/canvas/world-canvas';
import { MessageModal } from '@/components/modals/message-modal';
import { ItemSelect } from '@/components/selects/item-select';
import { Text } from '@/components/texts/text';
import { AuthContext } from '@/contexts/auth-context';
import { WorldMembersContext } from '@/contexts/world-members-context';
import { Button } from '@/components/buttons/button';
import { ShareWorldModal } from '@/components/modals/share-world-modal';
import { ItemModel } from '@/models/world/item/item-model';
import { EmbedModal } from '@/components/modals/embed-modal';
import { WorldJourneyServiceLoadTestContext } from '@/contexts/world-journey-load-test-context';
import { RemoveUnitsModal } from '@/components/modals/remove-units-modal';
import { PositionVo } from '@/models/world/common/position-vo';
import { DimensionVo } from '@/models/world/common/dimension-vo';
import { BoundVo } from '@/models/world/common/bound-vo';
import { BuildMazeModal } from '@/components/modals/build-maze-modal';
import { ReplayCommandsModal } from '@/components/modals/replay-commands-modal';
import { PortalUnitModel } from '@/models/world/unit/portal-unit-model';
import { ConfirmModal } from '@/components/modals/confirm-modal';
import { CreateEmbedUnitModal } from '@/components/modals/create-embed-unit-modal';
import { UnitTypeEnum } from '@/models/world/unit/unit-type-enum';
import { CreateLinkUnitModal } from '@/components/modals/create-link-unit-modal';
import { CreateSignUnitModal } from '@/components/modals/create-sign-unit-modal';

const Page = function Page({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const worldId = id;

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
    selectedUnitId,
    enterWorld,
    addPerspectiveDepth,
    subtractPerspectiveDepth,
    makePlayerStand,
    makePlayerWalk,
    sendPlayerIntoPortal,
    leaveWorld,
    changePlayerHeldItem,
    engageUnit,
    createUnit,
    createEmbedUnit,
    createLinkUnit,
    createSignUnit,
    buildMaze,
    replayCommands,
    removeUnit,
    rotateUnit,
    removeUnitsInBound,
    selectUnit,
    moveUnit,
    displayedEmbedCode,
    cleanDisplayedEmbedCode,
  } = useContext(WorldJourneyServiceContext);

  const [myPlayerHeldItemId, setMyPlayerHeldItemId] = useState<string | null>(null);
  const [myPlayerPosText, setMyPlayerPosText] = useState<string | null>(null);
  useEffect(() => {
    if (!worldJourneyService) return () => {};

    return worldJourneyService.subscribe('MY_PLAYER_UPDATED', ([, player]) => {
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

  const [isCreateEmbedUnitModalVisible, setIsCreateEmbedUnitModalVisible] = useState(false);
  const handleCreateEmbedUnitConfirm = useCallback(
    (label: string, embedCode: string) => {
      if (!myPlayerHeldItemId) return;

      createEmbedUnit(myPlayerHeldItemId, label, embedCode);
      setIsCreateEmbedUnitModalVisible(false);
    },
    [myPlayerHeldItemId, createEmbedUnit]
  );

  const [isCreateLinkUnitModalVisible, setIsCreateLinkUnitModalVisible] = useState(false);
  const handleCreateLinkUnitConfirm = useCallback(
    (label: string, url: string) => {
      if (!myPlayerHeldItemId) return;

      createLinkUnit(myPlayerHeldItemId, label, url);
      setIsCreateLinkUnitModalVisible(false);
    },
    [myPlayerHeldItemId, createLinkUnit]
  );

  const [isCreateSignUnitModalVisible, setIsCreateSignUnitModalVisible] = useState(false);
  const handleCreateSignUnitConfirm = useCallback(
    (label: string) => {
      if (!myPlayerHeldItemId) return;

      createSignUnit(myPlayerHeldItemId, label);
      setIsCreateSignUnitModalVisible(false);
    },
    [myPlayerHeldItemId, createSignUnit]
  );

  const handleCreateUnitPressedKeysChange = useCallback(
    (keys: string[]) => {
      if (keys.length === 0) return;
      if (!worldJourneyService) return;

      const compatibleUnitType = worldJourneyService.getMyPlayerHeldItem()?.getCompatibleUnitType();

      if (compatibleUnitType === UnitTypeEnum.Embed) {
        setIsCreateEmbedUnitModalVisible(true);
      } else if (compatibleUnitType === UnitTypeEnum.Link) {
        setIsCreateLinkUnitModalVisible(true);
      } else if (compatibleUnitType === UnitTypeEnum.Sign) {
        setIsCreateSignUnitModalVisible(true);
      } else {
        createUnit();
      }
    },
    [createUnit, createEmbedUnit, worldJourneyService]
  );
  useHotKeys(['KeyP'], { onPressedKeysChange: handleCreateUnitPressedKeysChange });

  const handleRemoveClick = useCallback(() => {
    if (!selectedUnitId) return;
    removeUnit(selectedUnitId);
  }, [removeUnit, selectedUnitId]);

  const handleRotateUnitClick = useCallback(() => {
    if (!selectedUnitId) return;
    rotateUnit(selectedUnitId);
  }, [rotateUnit, selectedUnitId]);

  const handleEngageUnitClick = useCallback(() => {
    if (!selectedUnitId) return;
    engageUnit(selectedUnitId);
  }, [engageUnit, selectedUnitId]);

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

  useHotKeys(['KeyS'], {
    onPressedKeysChange: (keys) => {
      if (keys.length === 0) return;
      selectUnit();
    },
  });

  useHotKeys(['KeyM'], {
    onPressedKeysChange: (keys) => {
      if (keys.length === 0) return;
      moveUnit();
    },
  });

  const handleMakePlayerWalkPressedKeysChange = useCallback(
    (keys: string[]) => {
      const lastKey = keys[keys.length - 1] || null;
      switch (lastKey) {
        case 'ArrowUp':
          makePlayerWalk(DirectionVo.newUp());
          break;
        case 'ArrowRight':
          makePlayerWalk(DirectionVo.newRight());
          break;
        case 'ArrowDown':
          makePlayerWalk(DirectionVo.newDown());
          break;
        case 'ArrowLeft':
          makePlayerWalk(DirectionVo.newLeft());
          break;
        default:
          makePlayerStand();
      }
    },
    [makePlayerStand, makePlayerWalk]
  );
  useHotKeys(['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'], {
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

  const [isRemoveUnitsModalVisible, setIsRemoveUnitsModalVisible] = useState(false);
  const handleRemoveUnitsClick = useCallback(() => {
    setIsRemoveUnitsModalVisible(true);
  }, []);

  const [isReplayCommandsModalVisible, setIsReplayCommandsModalVisible] = useState(false);
  const handleReplayClick = useCallback(() => {
    setIsReplayCommandsModalVisible(true);
  }, []);

  const handleReplayConfirm = useCallback(
    (duration: number, speed: number) => {
      replayCommands(duration, speed);
      setIsReplayCommandsModalVisible(false);
    },
    [replayCommands]
  );

  const handleRemoveUnitsConfirm = useCallback(
    (origin: PositionVo, dimension: DimensionVo) => {
      const from = origin;
      const to = from.shift(dimension.getWidth(), dimension.getDepth());

      const bound = BoundVo.create(from, to);
      removeUnitsInBound(bound);
      setIsRemoveUnitsModalVisible(false);
    },
    [removeUnitsInBound]
  );

  const [isBuildMazeModalVisible, setIsBuildMazeModalVisible] = useState(false);
  const handleBuildMazeClick = useCallback(() => {
    setIsBuildMazeModalVisible(true);
  }, []);

  const handleBuildMazeConfirm = useCallback(
    (item: ItemModel, origin: PositionVo, dimension: DimensionVo) => {
      buildMaze(item, origin, dimension);
      setIsBuildMazeModalVisible(false);
    },
    [buildMaze]
  );

  const [myPlayerEnteredPortalUnit, setMyPlayerEnteredPortalUnit] = useState<PortalUnitModel | null>(null);
  const [showSendPlayerIntoPortalConfirmModal, setShowSendPlayerIntoPortalConfirmModal] = useState(false);
  useEffect(() => {
    if (!worldJourneyService) return () => {};

    return worldJourneyService.subscribe('MY_PLAYER_ENTERED_PORTAL_UNIT', (unit) => {
      setMyPlayerEnteredPortalUnit(unit);
      setShowSendPlayerIntoPortalConfirmModal(true);
      makePlayerStand();
    });
  }, [worldJourneyService, makePlayerStand]);

  const handleSendPlayerIntoPortalConfirm = useCallback(
    async (confirmed: boolean) => {
      setShowSendPlayerIntoPortalConfirmModal(false);

      if (!worldJourneyService || !myPlayerEnteredPortalUnit) return;

      if (confirmed) {
        sendPlayerIntoPortal(myPlayerEnteredPortalUnit.getId());
      }
    },
    [sendPlayerIntoPortal, myPlayerEnteredPortalUnit]
  );

  return (
    <main className="relative w-full h-screen">
      {isCreateEmbedUnitModalVisible && (
        <CreateEmbedUnitModal
          opened={isCreateEmbedUnitModalVisible}
          onCancel={() => setIsCreateEmbedUnitModalVisible(false)}
          onConfirm={handleCreateEmbedUnitConfirm}
        />
      )}
      {isCreateLinkUnitModalVisible && (
        <CreateLinkUnitModal
          opened={isCreateLinkUnitModalVisible}
          onCancel={() => setIsCreateLinkUnitModalVisible(false)}
          onConfirm={handleCreateLinkUnitConfirm}
        />
      )}
      {isCreateSignUnitModalVisible && (
        <CreateSignUnitModal
          opened={isCreateSignUnitModalVisible}
          onCancel={() => setIsCreateSignUnitModalVisible(false)}
          onConfirm={handleCreateSignUnitConfirm}
        />
      )}
      {displayedEmbedCode && <EmbedModal opened embedCode={displayedEmbedCode} onClose={cleanDisplayedEmbedCode} />}
      {myPlayerEnteredPortalUnit && showSendPlayerIntoPortalConfirmModal && (
        <ConfirmModal
          opened={showSendPlayerIntoPortalConfirmModal}
          onCancel={() => handleSendPlayerIntoPortalConfirm(false)}
          message="Are you sure you want to send your player into the portal?"
          onComfirm={() => handleSendPlayerIntoPortalConfirm(true)}
        />
      )}
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
      {items && worldJourneyService && (
        <BuildMazeModal
          opened={isBuildMazeModalVisible}
          items={items}
          onComfirm={handleBuildMazeConfirm}
          onCancel={() => {
            setIsBuildMazeModalVisible(false);
          }}
        />
      )}
      <ReplayCommandsModal
        opened={isReplayCommandsModalVisible}
        onComfirm={handleReplayConfirm}
        onCancel={() => {
          setIsReplayCommandsModalVisible(false);
        }}
      />
      <RemoveUnitsModal
        opened={isRemoveUnitsModalVisible}
        onComfirm={handleRemoveUnitsConfirm}
        onCancel={() => {
          setIsRemoveUnitsModalVisible(false);
        }}
      />
      <div className="absolute top-2 right-3 z-10 flex items-center gap-2">
        <Button text="Replay" onClick={handleReplayClick} />
        <Button text="Build Maze" onClick={handleBuildMazeClick} />
        <Button text="Remove Units" onClick={handleRemoveUnitsClick} />
        <Button text="Share" onClick={handleShareClick} />
        <div className="min-w-24 flex justify-center">
          <Text size="text-xl">{myPlayerPosText}</Text>
        </div>
      </div>
      {selectedUnitId && (
        <div className="absolute top-16 right-2 z-10 flex flex-col items-end gap-2">
          <Button text="Remove" onClick={handleRemoveClick} />
          <Button text="Rotate" onClick={handleRotateUnitClick} />
          <Button text="Engage" onClick={handleEngageUnitClick} />
        </div>
      )}
      <section className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 w-screen">
        <ItemSelect items={items} selectedItemId={myPlayerHeldItemId} onSelect={handleItemSelect} />
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
        <section className="w-full h-full">{worldJourneyService && <WorldCanvas worldJourneyService={worldJourneyService} />}</section>
      </section>
    </main>
  );
};

export default Page;
