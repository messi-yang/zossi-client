import { createContext, useCallback, useRef, useState, useMemo, useEffect } from 'react';
import { WorldJourneyApi } from '@/adapters/apis/world-journey-api';
import { ItemApi } from '@/adapters/apis/item-api';
import { ItemModel } from '@/models/world/item/item-model';
import { DirectionVo } from '@/models/world/common/direction-vo';
import { WorldJourneyService } from '@/services/world-journey-service';
import { PositionVo } from '@/models/world/common/position-vo';
import { PlayerActionVo } from '@/models/world/player/player-action-vo';
import { ChangePlayerActionCommand } from '@/services/world-journey-service/managers/command-manager/commands/change-player-action-command';
import { CreateStaticUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/create-static-unit-command';
import { ChangePlayerHeldItemCommand } from '@/services/world-journey-service/managers/command-manager/commands/change-player-held-item-command';
import { CreatePortalUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/create-portal-unit-command';
import { RemoveStaticUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/remove-static-unit-command';
import { RemovePortalUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/remove-portal-unit-command';
import { RotateUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/rotate-unit-command';
import { CreateFenceUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/create-fence-unit-command';
import { RemoveFenceUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/remove-fence-unit-command';
import { CreateLinkUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/create-link-unit-command';
import { RemoveLinkUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/remove-link-unit-command';
import { dipatchUnitType } from '@/models/world/unit/utils';
import { LinkUnitModel } from '@/models/world/unit/link-unit-model';
import { LinkUnitApi } from '@/adapters/apis/link-unit-api';
import { NotificationEventDispatcher } from '@/event-dispatchers/notification-event-dispatcher';
import { CreateEmbedUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/create-embed-unit-command';
import { RemoveEmbedUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/remove-embed-unit-command';
import { EmbedUnitModel } from '@/models/world/unit/embed-unit-model';
import { EmbedUnitApi } from '@/adapters/apis/embed-unit-api';
import { BoundVo } from '@/models/world/common/bound-vo';
import { sleep } from '@/utils/general';
import { DimensionVo } from '@/models/world/common/dimension-vo';
import { MazeVo } from '@/models/global/maze-vo';
import { SendPlayerIntoPortalCommand } from '@/services/world-journey-service/managers/command-manager/commands/send-player-into-portal-command';
import { PortalUnitApi } from '@/adapters/apis/portal-unit-api';
import { TeleportPlayerCommand } from '@/services/world-journey-service/managers/command-manager/commands/teleport-player-command';
import { ColorVo } from '@/models/world/common/color-vo';
import { CreateColorUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/create-color-unit-command';
import { RemoveColorUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/remove-color-unit-command';
import { RemoveSignUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/remove-sign-unit-command';
import { CreateSignUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/create-sign-unit-command';

type ConnectionStatus = 'WAITING' | 'CONNECTING' | 'OPEN' | 'DISCONNECTED';

type ContextValue = {
  worldJourneyService: WorldJourneyService | null;
  connectionStatus: ConnectionStatus;
  items: ItemModel[] | null;
  selectedUnitId: string | null;
  enterWorld: (worldId: string) => void;
  updateCameraPosition: () => void;
  makePlayerStand: () => void;
  makePlayerWalk: (direction: DirectionVo) => void;
  sendPlayerIntoPortal: (unitId: string) => void;
  changePlayerHeldItem: (item: ItemModel) => void;
  engageUnit: (unitId: string) => void;
  createUnit: () => void;
  createEmbedUnit: (itemId: string, label: string, embedCode: string) => void;
  createLinkUnit: (itemId: string, label: string, url: string) => void;
  createSignUnit: (itemId: string, label: string) => void;
  buildMaze: (item: ItemModel, origin: PositionVo, dimension: DimensionVo) => void;
  replayCommands: (duration: number, speed: number) => void;
  removeUnit: (unitId: string) => void;
  rotateUnit: (unitId: string) => void;
  removeUnitsInBound: (bound: BoundVo) => void;
  moveUnit: () => void;
  selectUnit: () => void;
  leaveWorld: () => void;
  displayedEmbedCode: string | null;
  cleanDisplayedEmbedCode: () => void;
};

const Context = createContext<ContextValue>({
  worldJourneyService: null,
  connectionStatus: 'WAITING',
  items: null,
  selectedUnitId: null,
  enterWorld: () => {},
  updateCameraPosition: () => {},
  makePlayerStand: () => {},
  makePlayerWalk: () => {},
  sendPlayerIntoPortal: () => {},
  changePlayerHeldItem: () => {},
  engageUnit: () => {},
  createUnit: () => {},
  createEmbedUnit: () => {},
  createLinkUnit: () => {},
  createSignUnit: () => {},
  buildMaze: () => {},
  replayCommands: () => {},
  removeUnit: () => {},
  rotateUnit: () => {},
  removeUnitsInBound: () => {},
  moveUnit: () => {},
  selectUnit: () => {},
  leaveWorld: () => {},
  displayedEmbedCode: null,
  cleanDisplayedEmbedCode: () => {},
});

type Props = {
  children: React.ReactNode;
};

export function Provider({ children }: Props) {
  const linkUnitApi = useMemo(() => LinkUnitApi.create(), []);
  const embedUnitApi = useMemo(() => EmbedUnitApi.create(), []);
  const portalUnitApi = useMemo(() => PortalUnitApi.create(), []);
  const itemApi = useMemo<ItemApi>(() => ItemApi.create(), []);
  const [items, setItems] = useState<ItemModel[] | null>([]);
  const [worldJourneyService, setWorldJourneyService] = useState<WorldJourneyService | null>(null);
  useEffect(() => {
    // @ts-expect-error
    window.worldJourneyService = worldJourneyService;
  }, [worldJourneyService]);

  const notificationEventDispatcher = useMemo(() => NotificationEventDispatcher.create(), []);

  const [displayedEmbedCode, setDisplayedEmbedCode] = useState<string | null>(null);
  const cleanDisplayedEmbedCode = useCallback(() => {
    setDisplayedEmbedCode(null);
  }, []);

  useEffect(() => {
    if (!worldJourneyService) return () => {};

    return worldJourneyService.subscribe('PLACEHOLDER_ITEM_IDS_ADDED', (placeholderItemIds) => {
      itemApi.getItemsOfIds(placeholderItemIds).then((_items) => {
        _items.forEach((item) => {
          worldJourneyService.loadItem(item);
        });
      });
    });
  }, [worldJourneyService]);

  const fetchItems = useCallback(async () => {
    const newItems = await itemApi.getItems();
    setItems(newItems);
  }, []);
  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (!worldJourneyService || !items) return;
    items.forEach((item) => {
      worldJourneyService.loadItem(item);
    });
  }, [worldJourneyService, items]);

  const worldJourneyApi = useRef<WorldJourneyApi | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('WAITING');

  useEffect(() => {
    return () => {
      worldJourneyService?.destroy();
    };
  }, [worldJourneyService]);

  const leaveWorld = useCallback(() => {
    worldJourneyApi.current?.disconnect();
    worldJourneyApi.current = null;
    setWorldJourneyService(null);
    setConnectionStatus('WAITING');
  }, []);

  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  useEffect(() => {
    if (!worldJourneyService) return () => {};

    setSelectedUnitId(worldJourneyService.getSelectedUnitId());

    return worldJourneyService.subscribe('SELECTED_UNIT_ID_UPDATED', ([, newSelectedUnitId]) => {
      setSelectedUnitId(newSelectedUnitId);
    });
  }, [worldJourneyService]);

  const enterWorld = useCallback((worldId: string) => {
    if (worldJourneyApi.current) {
      leaveWorld();
      return;
    }

    let newWorldJourneyService: WorldJourneyService | null = null;
    const newWorldJourneyApi = WorldJourneyApi.create(worldId, {
      onWorldEntered: (_worldJourneyService) => {
        newWorldJourneyService = _worldJourneyService;
        setWorldJourneyService(_worldJourneyService);
      },
      onCommandReceived: (command) => {
        if (!newWorldJourneyService) return;
        newWorldJourneyService.executeRemoteCommand(command);
      },
      onCommandFailed: (commandId) => {
        if (!newWorldJourneyService) return;
        newWorldJourneyService.removeFailedCommand(commandId);
      },
      onUnitsReturned: (blocks, units) => {
        if (!newWorldJourneyService) return;

        for (let blockIndex = 0; blockIndex < blocks.length; blockIndex += 1) {
          const block = blocks[blockIndex];
          newWorldJourneyService.addBlock(block);
        }
        newWorldJourneyService.addUnits(units);
      },
      onErrored: (message) => {
        notificationEventDispatcher.publishErrorTriggeredEvent(message);
      },
      onOpen: () => {
        setConnectionStatus('OPEN');
      },
      onDisconnect: () => {
        worldJourneyApi.current = null;
        setWorldJourneyService(null);
        setConnectionStatus('DISCONNECTED');
      },
    });
    setConnectionStatus('CONNECTING');
    worldJourneyApi.current = newWorldJourneyApi;
  }, []);

  const sendPlayerIntoPortal = useCallback(
    async (unitId: string) => {
      if (!worldJourneyService) return;

      const command = SendPlayerIntoPortalCommand.create(worldJourneyService.getMyPlayer().getId(), unitId);
      worldJourneyService.executeLocalCommand(command);

      const myPlayer = worldJourneyService.getMyPlayer();
      const targetPosition = await portalUnitApi.getPortalUnitTargetPosition(command.getUnitId());
      const newCommand = TeleportPlayerCommand.create(myPlayer.getId(), targetPosition ?? myPlayer.getPosition());
      worldJourneyService.executeLocalCommand(newCommand);
    },
    [worldJourneyService]
  );

  // When my player walks into a portal, get its target position and sends my player to there
  useEffect(() => {
    if (!worldJourneyService) return () => {};

    return worldJourneyService.subscribe('LOCAL_COMMAND_EXECUTED', async (command) => {
      if (!worldJourneyApi.current) return;
      if (!(command instanceof SendPlayerIntoPortalCommand)) return;

      const myPlayer = worldJourneyService.getMyPlayer();
      const playerId = command.getPlayerId();
      if (myPlayer.getId() !== playerId) return;

      const targetPosition = await portalUnitApi.getPortalUnitTargetPosition(command.getUnitId());
      const newCommand = TeleportPlayerCommand.create(playerId, targetPosition ?? myPlayer.getPosition());
      worldJourneyService.executeLocalCommand(newCommand);
    });
  }, [worldJourneyService]);

  useEffect(() => {
    if (!worldJourneyService) return () => {};

    return worldJourneyService.subscribe('PLACEHOLDER_BLOCKS_ADDED', (blockIds) => {
      if (!worldJourneyApi.current) return;

      worldJourneyApi.current.fetchUnits(blockIds);
    });
  }, [worldJourneyService]);

  useEffect(() => {
    if (!worldJourneyService) return () => {};

    return worldJourneyService.subscribe('LOCAL_COMMAND_EXECUTED', (command) => {
      if (!worldJourneyApi.current) return;

      worldJourneyApi.current.sendCommand(command);
    });
  }, [worldJourneyService]);

  const updateCameraPosition = useCallback(() => {
    if (!worldJourneyService) return;

    worldJourneyService.updateCameraPosition();
  }, [worldJourneyService]);

  const makePlayerStand = useCallback(() => {
    if (!worldJourneyApi.current || !worldJourneyService) {
      return;
    }

    const myPlayer = worldJourneyService.getMyPlayer();
    if (myPlayer.getAction().isStand()) return;

    const playerDirection = worldJourneyService.getMyPlayer().getDirection();
    const playerAction = PlayerActionVo.newStand(playerDirection);
    const command = ChangePlayerActionCommand.create(myPlayer.getId(), playerAction);
    worldJourneyService.executeLocalCommand(command);
  }, [worldJourneyService]);

  const makePlayerWalk = useCallback(
    (direction: DirectionVo) => {
      if (!worldJourneyApi.current || !worldJourneyService) {
        return;
      }

      const myPlayer = worldJourneyService.getMyPlayer();
      const playerAction = PlayerActionVo.newWalk(direction);
      const command = ChangePlayerActionCommand.create(myPlayer.getId(), playerAction);
      worldJourneyService.executeLocalCommand(command);
    },
    [worldJourneyService]
  );

  const changePlayerHeldItem = useCallback(
    (item: ItemModel) => {
      if (!worldJourneyService || !worldJourneyApi.current) return;

      const command = ChangePlayerHeldItemCommand.create(worldJourneyService.getMyPlayer().getId(), item.getId());
      worldJourneyService.executeLocalCommand(command);
    },
    [worldJourneyService]
  );

  const createStaticUnit = useCallback(
    (itemId: string, position: PositionVo, direction: DirectionVo) => {
      if (!worldJourneyService || !worldJourneyApi.current) return;

      const command = CreateStaticUnitCommand.create(itemId, position, direction);
      worldJourneyService.executeLocalCommand(command);
    },
    [worldJourneyService]
  );

  const createFenceUnit = useCallback(
    (itemId: string, position: PositionVo, direction: DirectionVo) => {
      if (!worldJourneyService || !worldJourneyApi.current) return;

      const command = CreateFenceUnitCommand.create(itemId, position, direction);
      worldJourneyService.executeLocalCommand(command);
    },
    [worldJourneyService]
  );

  const createPortalUnit = useCallback(
    (itemId: string, position: PositionVo, direction: DirectionVo) => {
      if (!worldJourneyService || !worldJourneyApi.current) return;

      const command = CreatePortalUnitCommand.create(itemId, position, direction);
      worldJourneyService.executeLocalCommand(command);
    },
    [worldJourneyService]
  );

  const createColorUnit = useCallback(
    (itemId: string, position: PositionVo, direction: DirectionVo, color: ColorVo) => {
      if (!worldJourneyService || !worldJourneyApi.current) return;

      const command = CreateColorUnitCommand.create(itemId, position, direction, color);
      worldJourneyService.executeLocalCommand(command);
    },
    [worldJourneyService]
  );

  const createUnit = useCallback(() => {
    if (!worldJourneyService) return;

    const myPlayerHeldItem = worldJourneyService.getMyPlayerHeldItem();
    if (!myPlayerHeldItem) return;

    const myPlayer = worldJourneyService.getMyPlayer();
    const desiredNewUnitPos = myPlayer.getDesiredNewUnitPosition(myPlayerHeldItem.getDimension());
    const direction = myPlayer.getDirection().getOppositeDirection();

    const compatibleUnitType = myPlayerHeldItem.getCompatibleUnitType();
    dipatchUnitType(compatibleUnitType, {
      static: () => {
        createStaticUnit(myPlayerHeldItem.getId(), desiredNewUnitPos, direction);
      },
      fence: () => {
        createFenceUnit(myPlayerHeldItem.getId(), desiredNewUnitPos, direction);
      },
      portal: () => {
        createPortalUnit(myPlayerHeldItem.getId(), desiredNewUnitPos, direction);
      },
      link: () => {},
      embed: () => {},
      color: () => {
        createColorUnit(myPlayerHeldItem.getId(), desiredNewUnitPos, direction, ColorVo.createRandom());
      },
      sign: () => {},
    });
  }, [worldJourneyService]);

  const createEmbedUnit = useCallback(
    (itemId: string, label: string, embedCode: string) => {
      if (!worldJourneyService) return;

      const response = worldJourneyService.getDesiredNewUnitPositionAndDirection(itemId);
      if (!response) return;

      const command = CreateEmbedUnitCommand.create(itemId, response.position, response.direction, label, embedCode);
      worldJourneyService.executeLocalCommand(command);
    },
    [worldJourneyService]
  );

  const createLinkUnit = useCallback(
    (itemId: string, label: string, url: string) => {
      if (!worldJourneyService) return;

      const response = worldJourneyService.getDesiredNewUnitPositionAndDirection(itemId);
      if (!response) return;

      const command = CreateLinkUnitCommand.create(itemId, response.position, response.direction, label, url);
      worldJourneyService.executeLocalCommand(command);
    },
    [worldJourneyService]
  );

  const createSignUnit = useCallback(
    (itemId: string, label: string) => {
      if (!worldJourneyService) return;

      const response = worldJourneyService.getDesiredNewUnitPositionAndDirection(itemId);
      if (!response) return;

      const command = CreateSignUnitCommand.create(itemId, response.position, response.direction, label);
      worldJourneyService.executeLocalCommand(command);
    },
    [worldJourneyService]
  );

  const engageUnit = useCallback(
    async (unitId: string) => {
      if (!worldJourneyService) return;

      const unit = worldJourneyService.getUnit(unitId);
      if (!unit) return;

      if (unit instanceof LinkUnitModel) {
        const linkUnitUrl = await linkUnitApi.getLinkUnitUrl(unit.getId());
        window.open(linkUnitUrl);
      } else if (unit instanceof EmbedUnitModel) {
        const embedUnitUrl = await embedUnitApi.getEmbedUnitEmbedCode(unit.getId());
        setDisplayedEmbedCode(embedUnitUrl);
      }
    },
    [worldJourneyService]
  );

  const buildMaze = useCallback(
    (item: ItemModel, origin: PositionVo, dimension: DimensionVo) => {
      if (!worldJourneyService) return;

      const maze = MazeVo.create(dimension.getWidth(), dimension.getDepth());
      maze.iterateSync(async (pos, isWall) => {
        if (isWall) {
          createFenceUnit(item.getId(), origin.shift(PositionVo.create(pos.getX(), pos.getZ())), DirectionVo.newDown());
          await sleep(10);
        }
      });
    },
    [worldJourneyService, createFenceUnit]
  );

  const replayCommands = useCallback(
    (duration: number, speed: number) => {
      if (!worldJourneyService) return;

      worldJourneyService.replayCommands(duration, speed);
    },
    [worldJourneyService]
  );

  /**
   * If a unit is removed, return true
   */
  const removeUnitByType = useCallback(
    (unitId: string): boolean => {
      if (!worldJourneyService) return false;
      const unit = worldJourneyService.getUnit(unitId);
      if (!unit) return false;

      dipatchUnitType(unit.getType(), {
        static: () => {
          if (!worldJourneyApi.current) return;

          const command = RemoveStaticUnitCommand.create(unitId);
          worldJourneyService.executeLocalCommand(command);
        },
        fence: () => {
          if (!worldJourneyApi.current) return;

          const command = RemoveFenceUnitCommand.create(unitId);
          worldJourneyService.executeLocalCommand(command);
        },
        portal: () => {
          if (!worldJourneyApi.current) return;

          const command = RemovePortalUnitCommand.create(unitId);
          worldJourneyService.executeLocalCommand(command);
        },
        link: () => {
          if (!worldJourneyApi.current) return;

          const command = RemoveLinkUnitCommand.create(unitId);
          worldJourneyService.executeLocalCommand(command);
        },
        embed: () => {
          if (!worldJourneyApi.current) return;

          const command = RemoveEmbedUnitCommand.create(unitId);
          worldJourneyService.executeLocalCommand(command);
        },
        color: () => {
          if (!worldJourneyApi.current) return;

          const command = RemoveColorUnitCommand.create(unitId);
          worldJourneyService.executeLocalCommand(command);
        },
        sign: () => {
          if (!worldJourneyApi.current) return;

          const command = RemoveSignUnitCommand.create(unitId);
          worldJourneyService.executeLocalCommand(command);
        },
      });

      return true;
    },
    [worldJourneyService]
  );

  const removeUnit = useCallback(
    (unitId: string) => {
      if (!worldJourneyService) return;

      removeUnitByType(unitId);
    },
    [worldJourneyService]
  );

  const rotateUnit = useCallback(
    (unitId: string) => {
      if (!worldJourneyService) return;

      const unit = worldJourneyService.getUnit(unitId);
      if (!unit) return;

      const command = RotateUnitCommand.create(unitId);
      worldJourneyService.executeLocalCommand(command);
    },
    [worldJourneyService]
  );

  const removeUnitsInBound = useCallback(
    (bound: BoundVo) => {
      if (!worldJourneyService) return;
      bound.iterateSync(async (position) => {
        const unitAtPos = worldJourneyService.getUnitByPos(position);
        if (!unitAtPos) return;

        const removed = removeUnitByType(unitAtPos.getId());
        if (removed) await sleep(10);
      });
    },
    [worldJourneyService]
  );

  const moveUnit = useCallback(() => {
    if (!worldJourneyService) return;

    const currentSelectedUnitId = worldJourneyService.getSelectedUnitId();
    if (!currentSelectedUnitId) return;

    const selectedUnit = worldJourneyService.getUnit(currentSelectedUnitId);
    if (!selectedUnit) return;

    const myPlayer = worldJourneyService.getMyPlayer();
    const desiredNewUnitPos = myPlayer.getDesiredNewUnitPosition(selectedUnit.getDimension());

    worldJourneyService.moveUnit(currentSelectedUnitId, desiredNewUnitPos);
  }, [worldJourneyService]);

  const selectUnit = useCallback(() => {
    if (!worldJourneyService) return;

    const myPlayer = worldJourneyService.getMyPlayer();
    const myPlayerFowardPos = myPlayer.getFowardPosition(1);

    const unitAtPos = worldJourneyService.getUnitByPos(myPlayerFowardPos);

    if (unitAtPos) {
      const currentSelectedUnitId = worldJourneyService.getSelectedUnitId();
      if (currentSelectedUnitId === unitAtPos.getId()) {
        worldJourneyService.clearSelectedUnit();
      } else {
        worldJourneyService.selectUnit(unitAtPos.getId());
      }
    } else {
      worldJourneyService.clearSelectedUnit();
    }
  }, [worldJourneyService]);

  const context = {
    worldJourneyService,
    connectionStatus,
    items,
    selectedUnitId,
    enterWorld,
    updateCameraPosition,
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
    moveUnit,
    selectUnit,
    displayedEmbedCode,
    cleanDisplayedEmbedCode,
  };

  return <Context.Provider value={useMemo<ContextValue>(() => context, Object.values(context))}>{children}</Context.Provider>;
}

export { Provider as WorldJourneyServiceProvider, Context as WorldJourneyServiceContext };
