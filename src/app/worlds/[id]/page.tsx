'use client';

import { useEffect, useCallback, useRef, KeyboardEventHandler, useContext, useState, use, useMemo } from 'react';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { useHotKeys } from '@/hooks/use-hot-keys';
import { WorldJourneyServiceContext } from '@/contexts/world-journey-service-context';
import { DirectionVo } from '@/models/world/common/direction-vo';
import { WorldCanvas } from '@/components/canvas/world-canvas';
import { MessageModal } from '@/components/modals/message-modal';
import { Text } from '@/components/texts/text';
import { AuthContext } from '@/contexts/auth-context';
import { WorldMembersContext } from '@/contexts/world-members-context';
import { Button } from '@/components/buttons/button';
import { ShareWorldModal } from '@/components/modals/share-world-modal';
import { ItemModel } from '@/models/world/item/item-model';
import { EmbedModal } from '@/components/modals/embed-modal';
import { WorldJourneyServiceLoadTestContext } from '@/contexts/world-journey-load-test-context';
import { PositionVo } from '@/models/world/common/position-vo';
import { DimensionVo } from '@/models/world/common/dimension-vo';
import { BuildMazeModal } from '@/components/modals/build-maze-modal';
import { ConfirmModal } from '@/components/modals/confirm-modal';
import { CreateEmbedUnitModal } from '@/components/modals/create-embed-unit-modal';
import { UnitTypeEnum } from '@/models/world/unit/unit-type-enum';
import { CreateLinkUnitModal } from '@/components/modals/create-link-unit-modal';
import { CreateSignUnitModal } from '@/components/modals/create-sign-unit-modal';
import { WorldBottomPanel } from '@/components/panels/world-bottom-panel';
import { SelectItemModal } from '@/components/modals/select-item-modal';
import { InteractionMode } from '@/services/world-journey-service/managers/selection-manager/interaction-mode-enum';
import { UnitModel } from '@/models/world/unit/unit-model';

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
    selectedItem,
    interactionMode,
    enterWorld,
    updateCameraPosition,
    makePlayerStand,
    makePlayerWalk,
    sendPlayerIntoPortal,
    leaveWorld,
    engageUnit,
    createUnit,
    createEmbedUnit,
    createLinkUnit,
    createSignUnit,
    buildMaze,
    moveUnit,
    displayedEmbedCode,
    cleanDisplayedEmbedCode,
  } = useContext(WorldJourneyServiceContext);

  const [myPlayerPosText, setMyPlayerPosText] = useState<string | null>(null);
  useEffect(() => {
    if (!worldJourneyService) return () => {};

    return worldJourneyService.subscribe('MY_PLAYER_UPDATED', ([, player]) => {
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

  const [newUnitPosition, setNewUnitPosition] = useState<PositionVo | null>(null);

  const [isCreateEmbedUnitModalVisible, setIsCreateEmbedUnitModalVisible] = useState(false);
  const handleCreateEmbedUnitConfirm = useCallback(
    (label: string, embedCode: string) => {
      if (!worldJourneyService || !newUnitPosition) return;

      const item = worldJourneyService.getSelectedItem();
      if (!item) return;

      const currentSelectedItemDirection = worldJourneyService.getSelectedItemDirection();
      if (!currentSelectedItemDirection) return;

      createEmbedUnit(newUnitPosition, currentSelectedItemDirection, item.getId(), label, embedCode);
      setIsCreateEmbedUnitModalVisible(false);
    },
    [worldJourneyService, newUnitPosition]
  );

  const [isCreateLinkUnitModalVisible, setIsCreateLinkUnitModalVisible] = useState(false);
  const handleCreateLinkUnitConfirm = useCallback(
    (label: string, url: string) => {
      if (!worldJourneyService || !newUnitPosition) return;

      const item = worldJourneyService.getSelectedItem();
      if (!item) return;

      const currentSelectedItemDirection = worldJourneyService.getSelectedItemDirection();
      if (!currentSelectedItemDirection) return;

      createLinkUnit(newUnitPosition, currentSelectedItemDirection, item.getId(), label, url);
      setIsCreateLinkUnitModalVisible(false);
    },
    [worldJourneyService, newUnitPosition]
  );

  const [isCreateSignUnitModalVisible, setIsCreateSignUnitModalVisible] = useState(false);
  const handleCreateSignUnitConfirm = useCallback(
    (label: string) => {
      if (!worldJourneyService || !newUnitPosition) return;

      const item = worldJourneyService.getSelectedItem();
      if (!item) return;

      const currentSelectedItemDirection = worldJourneyService.getSelectedItemDirection();
      if (!currentSelectedItemDirection) return;

      createSignUnit(newUnitPosition, currentSelectedItemDirection, item.getId(), label);
      setIsCreateSignUnitModalVisible(false);
    },
    [worldJourneyService, newUnitPosition]
  );

  const handleUnitCreate = useCallback(
    (position: PositionVo) => {
      if (!worldJourneyService) return;

      const currentSelectedItem = worldJourneyService.getSelectedItem();
      if (!currentSelectedItem) return;

      const currentSelectedItemDirection = worldJourneyService.getSelectedItemDirection();
      if (!currentSelectedItemDirection) return;

      const compatibleUnitType = currentSelectedItem.getCompatibleUnitType();

      if (compatibleUnitType === UnitTypeEnum.Embed) {
        setNewUnitPosition(position);
        setIsCreateEmbedUnitModalVisible(true);
      } else if (compatibleUnitType === UnitTypeEnum.Link) {
        setNewUnitPosition(position);
        setIsCreateLinkUnitModalVisible(true);
      } else if (compatibleUnitType === UnitTypeEnum.Sign) {
        setNewUnitPosition(position);
        setIsCreateSignUnitModalVisible(true);
      } else {
        createUnit(position, currentSelectedItem, currentSelectedItemDirection);
      }
    },
    [worldJourneyService, createUnit]
  );

  const handleRemoveClick = useCallback(
    (unitId: string) => {
      if (!worldJourneyService) return;
      worldJourneyService.removeUnit(unitId);
    },
    [worldJourneyService]
  );

  const handleRotateUnitClick = useCallback(
    (unitId: string) => {
      if (!worldJourneyService) return;
      worldJourneyService.rotateUnit(unitId);
    },
    [worldJourneyService]
  );

  const handleEngageUnitClick = useCallback(
    (unitId: string) => {
      engageUnit(unitId);
    },
    [engageUnit]
  );

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

  const handleItemSelect = useCallback(
    (item: ItemModel) => {
      if (!worldJourneyService) return;

      worldJourneyService.selectItem(item.getId());
    },
    [worldJourneyService]
  );

  const handleRecconectModalConfirmClick = useCallback(() => {
    if (worldId) {
      enterWorld(worldId);
    }
  }, [enterWorld, worldId]);

  const handleReplayClick = useCallback(
    (duration: number) => {
      if (!worldJourneyService) return;
      worldJourneyService.replayCommands(duration, 5);
    },
    [worldJourneyService]
  );

  const handleDestroyClick = useCallback(() => {
    if (!worldJourneyService) return;

    if (interactionMode === InteractionMode.DESTROY) {
      worldJourneyService.turnOffDestroyMode();
    } else {
      worldJourneyService.turnOnDestroyMode();
    }
  }, [worldJourneyService, interactionMode]);

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

  const [myPlayerEnteredPortalUnit, setMyPlayerEnteredPortalUnit] = useState<UnitModel | null>(null);
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

  const handleUpdateCameraClick = useCallback(() => {
    updateCameraPosition();
  }, [updateCameraPosition]);

  const [isSelectItemModalVisible, setIsSelectItemModalVisible] = useState(false);
  const handleBuildClick = useCallback(() => {
    setIsSelectItemModalVisible(true);
  }, []);

  const handleRotateSelectedItemClick = useCallback(() => {
    if (!worldJourneyService) return;

    worldJourneyService.rotateSelectedItem();
  }, [worldJourneyService]);

  const bottomPanelMode = useMemo(() => {
    if (interactionMode === InteractionMode.SELECT || interactionMode === InteractionMode.DRAG) {
      return 'select';
    } else if (interactionMode === InteractionMode.PLACE) {
      return 'build';
    } else if (interactionMode === InteractionMode.DESTROY) {
      return 'destroy';
    } else {
      return null;
    }
  }, [interactionMode]);

  const handleMoveClick = useCallback(() => {
    if (!worldJourneyService) return;

    worldJourneyService.resetSelection();
  }, [worldJourneyService]);

  const handlePositionClick = useCallback(
    (position: PositionVo) => {
      if (!worldJourneyService) return;

      const currentSelectedItem = worldJourneyService.getSelectedItem();

      const currentSelectedUnit = worldJourneyService.getSelectedUnit();

      const unitAtPos = worldJourneyService.getUnitByPos(position);
      if (unitAtPos) {
        if (currentSelectedItem) return;
        if (interactionMode === InteractionMode.DESTROY) {
          worldJourneyService.removeUnit(unitAtPos.getId());
        } else {
          if (currentSelectedUnit && unitAtPos.getId() === currentSelectedUnit.getId()) {
            worldJourneyService.clearSelectedUnit();
          } else {
            worldJourneyService.selectUnit(unitAtPos.getId());
          }
        }
      } else if (currentSelectedUnit) {
        worldJourneyService.clearSelectedUnit();
      } else if (currentSelectedItem) {
        handleUnitCreate(position);
      }
    },
    [worldJourneyService, handleUnitCreate, interactionMode]
  );

  const handlePositionHover = useCallback(
    (position: PositionVo) => {
      if (!worldJourneyService) return;

      worldJourneyService.hoverPosition(position);
    },
    [worldJourneyService]
  );

  const handlePositionDragStart = useCallback(
    (position: PositionVo) => {
      if (!worldJourneyService) return;

      const currentSelectedItem = worldJourneyService.getSelectedItem();
      if (currentSelectedItem) return;

      const unitAtPos = worldJourneyService.getUnitByPos(position);
      if (unitAtPos) {
        const item = worldJourneyService.getItem(unitAtPos.getItemId());
        if (!item) return;
        worldJourneyService.dragUnit(unitAtPos.getId());
      }
    },
    [worldJourneyService]
  );

  const handlePositionDragEnd = useCallback(
    (position: PositionVo) => {
      if (!worldJourneyService) return;

      const draggedUnit = worldJourneyService.getDraggedUnit();
      if (!draggedUnit) return;

      const unitAtPos = worldJourneyService.getUnitByPos(position);
      if (!unitAtPos) {
        worldJourneyService.moveUnit(draggedUnit.getId(), position);
        worldJourneyService.selectUnit(draggedUnit.getId());
      } else {
        worldJourneyService.clearDraggedUnit();
      }
    },
    [worldJourneyService]
  );

  const handlePositionDragCancel = useCallback(() => {
    if (!worldJourneyService) return;

    worldJourneyService.clearDraggedUnit();
  }, [worldJourneyService]);

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
      <div className="absolute top-2 right-3 z-10 flex items-center gap-2">
        <Button text="Build Maze" onClick={handleBuildMazeClick} />
        <Button text="Share" onClick={handleShareClick} />
        <div className="min-w-24 flex justify-center">
          <Text size="text-xl">{myPlayerPosText}</Text>
        </div>
      </div>
      <section className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10">
        <SelectItemModal
          opened={isSelectItemModalVisible}
          items={items ?? []}
          selectedItemId={selectedItem?.getId() ?? null}
          onItemSelect={handleItemSelect}
          onClose={() => setIsSelectItemModalVisible(false)}
        />
        <WorldBottomPanel
          selectedItem={selectedItem}
          activeTab={bottomPanelMode}
          onMoveClick={handleMoveClick}
          onCameraClick={handleUpdateCameraClick}
          onBuildClick={handleBuildClick}
          onRotateSelectedItemClick={handleRotateSelectedItemClick}
          onReplayClick={handleReplayClick}
          onDestroyClick={handleDestroyClick}
        />
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
          {worldJourneyService && (
            <WorldCanvas
              worldJourneyService={worldJourneyService}
              onPositionClick={handlePositionClick}
              onPositionHover={handlePositionHover}
              onPositionDragStart={handlePositionDragStart}
              onPositionDragEnd={handlePositionDragEnd}
              onPositionDragCancel={handlePositionDragCancel}
              onRotateUnitClick={handleRotateUnitClick}
              onEngageUnitClick={handleEngageUnitClick}
              onRemoveUnitClick={handleRemoveClick}
            />
          )}
        </section>
      </section>
    </main>
  );
};

export default Page;
