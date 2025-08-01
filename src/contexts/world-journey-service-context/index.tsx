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
import { CreatePortalUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/create-portal-unit-command';
import { CreateFenceUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/create-fence-unit-command';
import { CreateLinkUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/create-link-unit-command';
import { dipatchUnitType } from '@/models/world/unit/utils';
import { LinkUnitApi } from '@/adapters/apis/link-unit-api';
import { NotificationEventDispatcher } from '@/event-dispatchers/notification-event-dispatcher';
import { CreateEmbedUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/create-embed-unit-command';
import { EmbedUnitApi } from '@/adapters/apis/embed-unit-api';
import { sleep } from '@/utils/general';
import { DimensionVo } from '@/models/world/common/dimension-vo';
import { MazeVo } from '@/models/global/maze-vo';
import { SendPlayerIntoPortalCommand } from '@/services/world-journey-service/managers/command-manager/commands/send-player-into-portal-command';
import { PortalUnitApi } from '@/adapters/apis/portal-unit-api';
import { TeleportPlayerCommand } from '@/services/world-journey-service/managers/command-manager/commands/teleport-player-command';
import { ColorVo } from '@/models/world/common/color-vo';
import { CreateColorUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/create-color-unit-command';
import { CreateSignUnitCommand } from '@/services/world-journey-service/managers/command-manager/commands/create-sign-unit-command';
import { UnitModel } from '@/models/world/unit/unit-model';
import { InteractionMode } from '@/services/world-journey-service/managers/selection-manager/interaction-mode-enum';
import { UnitTypeEnum } from '@/models/world/unit/unit-type-enum';

type ConnectionStatus = 'WAITING' | 'CONNECTING' | 'OPEN' | 'DISCONNECTED';

type ContextValue = {
  worldJourneyService: WorldJourneyService | null;
  connectionStatus: ConnectionStatus;
  items: ItemModel[] | null;
  selectedUnit: UnitModel | null;
  selectedItem: ItemModel | null;
  interactionMode: InteractionMode;
  enterWorld: (worldId: string) => void;
  updateCameraPosition: () => void;
  makePlayerStand: () => void;
  makePlayerWalk: (direction: DirectionVo) => void;
  sendPlayerIntoPortal: (unitId: string) => void;
  engageUnit: (unitId: string) => void;
  createUnit: (position: PositionVo, item: ItemModel, direction: DirectionVo) => void;
  createEmbedUnit: (item: ItemModel, position: PositionVo, direction: DirectionVo, label: string, embedCode: string) => void;
  createLinkUnit: (item: ItemModel, position: PositionVo, direction: DirectionVo, label: string, url: string) => void;
  createSignUnit: (item: ItemModel, position: PositionVo, direction: DirectionVo, label: string) => void;
  buildMaze: (item: ItemModel, origin: PositionVo, dimension: DimensionVo) => void;
  moveUnit: () => void;
  leaveWorld: () => void;
  displayedEmbedCode: string | null;
  cleanDisplayedEmbedCode: () => void;
};

const Context = createContext<ContextValue>({
  worldJourneyService: null,
  connectionStatus: 'WAITING',
  items: null,
  selectedUnit: null,
  selectedItem: null,
  interactionMode: InteractionMode.SELECT,
  enterWorld: () => {},
  updateCameraPosition: () => {},
  makePlayerStand: () => {},
  makePlayerWalk: () => {},
  sendPlayerIntoPortal: () => {},
  engageUnit: () => {},
  createUnit: () => {},
  createEmbedUnit: () => {},
  createLinkUnit: () => {},
  createSignUnit: () => {},
  buildMaze: () => {},
  moveUnit: () => {},
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

  const [selectedUnit, setSelectedUnit] = useState<UnitModel | null>(null);
  useEffect(() => {
    if (!worldJourneyService) return () => {};

    setSelectedUnit(worldJourneyService.getSelectedUnit());

    const selectedUnitAddedUnsubscribe = worldJourneyService.subscribe('SELECTED_UNIT_ADDED', (newSelectedUnit) => {
      setSelectedUnit(newSelectedUnit);
    });

    const selectedUnitRemovedUnsubscribe = worldJourneyService.subscribe('SELECTED_UNIT_REMOVED', () => {
      setSelectedUnit(null);
    });

    return () => {
      selectedUnitAddedUnsubscribe();
      selectedUnitRemovedUnsubscribe();
    };
  }, [worldJourneyService]);

  const [selectedItem, setSelectedItem] = useState<ItemModel | null>(null);
  useEffect(() => {
    if (!worldJourneyService) return () => {};

    const selectedItemAddedUnsubscribe = worldJourneyService.subscribe('SELECTED_ITEM_ADDED', ({ item }) => {
      setSelectedItem(item);
    });

    const selectedItemRemovedUnsubscribe = worldJourneyService.subscribe('SELECTED_ITEM_REMOVED', () => {
      setSelectedItem(null);
    });

    return () => {
      selectedItemAddedUnsubscribe();
      selectedItemRemovedUnsubscribe();
    };
  }, [worldJourneyService]);

  const [interactionMode, setInteractionMode] = useState<InteractionMode>(InteractionMode.SELECT);
  useEffect(() => {
    if (!worldJourneyService) return () => {};

    return worldJourneyService.subscribe('INTERACTION_MODE_UPDATED', (mode) => {
      setInteractionMode(mode);
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

  const createStaticUnit = useCallback(
    (item: ItemModel, position: PositionVo, direction: DirectionVo) => {
      if (!worldJourneyService || !worldJourneyApi.current) return;

      const command = CreateStaticUnitCommand.create(item.getId(), item.getCompatibleUnitType(), item.getDimension(), position, direction);
      worldJourneyService.executeLocalCommand(command);
    },
    [worldJourneyService]
  );

  const createFenceUnit = useCallback(
    (item: ItemModel, position: PositionVo, direction: DirectionVo) => {
      if (!worldJourneyService || !worldJourneyApi.current) return;

      const command = CreateFenceUnitCommand.create(item.getId(), item.getCompatibleUnitType(), item.getDimension(), position, direction);
      worldJourneyService.executeLocalCommand(command);
    },
    [worldJourneyService]
  );

  const createPortalUnit = useCallback(
    (item: ItemModel, position: PositionVo, direction: DirectionVo) => {
      if (!worldJourneyService || !worldJourneyApi.current) return;

      const command = CreatePortalUnitCommand.create(item.getId(), item.getCompatibleUnitType(), item.getDimension(), position, direction);
      worldJourneyService.executeLocalCommand(command);
    },
    [worldJourneyService]
  );

  const createColorUnit = useCallback(
    (item: ItemModel, position: PositionVo, direction: DirectionVo, color: ColorVo) => {
      if (!worldJourneyService || !worldJourneyApi.current) return;

      const command = CreateColorUnitCommand.create(
        item.getId(),
        item.getCompatibleUnitType(),
        item.getDimension(),
        position,
        direction,
        color
      );
      worldJourneyService.executeLocalCommand(command);
    },
    [worldJourneyService]
  );

  const createUnit = useCallback(
    (position: PositionVo, item: ItemModel, direction: DirectionVo) => {
      if (!worldJourneyService) return;

      const compatibleUnitType = item.getCompatibleUnitType();
      dipatchUnitType(compatibleUnitType, {
        static: () => {
          createStaticUnit(item, position, direction);
        },
        fence: () => {
          createFenceUnit(item, position, direction);
        },
        portal: () => {
          createPortalUnit(item, position, direction);
        },
        link: () => {},
        embed: () => {},
        color: () => {
          createColorUnit(item, position, direction, ColorVo.createRandom());
        },
        sign: () => {},
      });
    },
    [worldJourneyService]
  );

  const createEmbedUnit = useCallback(
    (item: ItemModel, position: PositionVo, direction: DirectionVo, label: string, embedCode: string) => {
      if (!worldJourneyService) return;

      const command = CreateEmbedUnitCommand.create(
        item.getId(),
        item.getCompatibleUnitType(),
        item.getDimension(),
        position,
        direction,
        label,
        embedCode
      );
      worldJourneyService.executeLocalCommand(command);
    },
    [worldJourneyService]
  );

  const createLinkUnit = useCallback(
    (item: ItemModel, position: PositionVo, direction: DirectionVo, label: string, url: string) => {
      if (!worldJourneyService) return;

      const command = CreateLinkUnitCommand.create(
        item.getId(),
        item.getCompatibleUnitType(),
        item.getDimension(),
        position,
        direction,
        label,
        url
      );
      worldJourneyService.executeLocalCommand(command);
    },
    [worldJourneyService]
  );

  const createSignUnit = useCallback(
    (item: ItemModel, position: PositionVo, direction: DirectionVo, label: string) => {
      if (!worldJourneyService) return;

      const command = CreateSignUnitCommand.create(
        item.getId(),
        item.getCompatibleUnitType(),
        item.getDimension(),
        position,
        direction,
        label
      );
      worldJourneyService.executeLocalCommand(command);
    },
    [worldJourneyService]
  );

  const engageUnit = useCallback(
    async (unitId: string) => {
      if (!worldJourneyService) return;

      const unit = worldJourneyService.getUnit(unitId);
      if (!unit) return;

      if (unit.getType() === UnitTypeEnum.Link) {
        const linkUnitUrl = await linkUnitApi.getLinkUnitUrl(unit.getId());
        window.open(linkUnitUrl);
      } else if (unit.getType() === UnitTypeEnum.Embed) {
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
          createFenceUnit(item, origin.shift(PositionVo.create(pos.getX(), pos.getZ())), DirectionVo.newDown());
          await sleep(10);
        }
      });
    },
    [worldJourneyService, createFenceUnit]
  );

  const moveUnit = useCallback(() => {
    if (!worldJourneyService) return;

    const currentSelectedUnit = worldJourneyService.getSelectedUnit();
    if (!currentSelectedUnit) return;

    const myPlayer = worldJourneyService.getMyPlayer();
    const desiredNewUnitPos = myPlayer.getDesiredNewUnitPosition(currentSelectedUnit.getDimension());

    worldJourneyService.moveUnit(currentSelectedUnit.getId(), desiredNewUnitPos);
  }, [worldJourneyService]);

  const context = {
    worldJourneyService,
    connectionStatus,
    items,
    selectedUnit,
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
  };

  return <Context.Provider value={useMemo<ContextValue>(() => context, Object.values(context))}>{children}</Context.Provider>;
}

export { Provider as WorldJourneyServiceProvider, Context as WorldJourneyServiceContext };
