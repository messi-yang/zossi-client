import { createContext, useCallback, useRef, useState, useMemo, useEffect } from 'react';
import { WorldJourneyApiService } from '@/apis/services/world-journey-api-service';
import { ItemApiService } from '@/apis/services/item-api-service';
import { ItemModel } from '@/models/world/item/item-model';
import { DirectionVo } from '@/models/world/common/direction-vo';
import {
  AddItemCommand,
  RotateUnitCommand,
  RemoveStaticUnitCommand,
  ChangePlayerHeldItemCommand,
  CreateStaticUnitCommand,
  CreatePortalUnitCommand,
  // SendPlayerIntoPortalCommand,
  RemovePortalUnitCommand,
  AddPerspectiveDepthCommand,
  SubtractPerspectiveDepthCommand,
  SendPlayerIntoPortalCommand,
  ChangePlayerActionCommand,
} from '@/logics/world-journey/commands';
import { WorldJourney } from '@/logics/world-journey';
import { PositionVo } from '@/models/world/common/position-vo';
import { PortalUnitModel } from '@/models/world/unit/portal-unit-model';
import { PlayerActionVo } from '@/models/world/player/player-action-vo';
import { DateVo } from '@/models/general/date-vo';

type ConnectionStatus = 'WAITING' | 'CONNECTING' | 'OPEN' | 'DISCONNECTING' | 'DISCONNECTED';

type ContextValue = {
  worldJourney: WorldJourney | null;
  connectionStatus: ConnectionStatus;
  items: ItemModel[] | null;
  enterWorld: (WorldId: string) => void;
  addPerspectiveDepth: () => void;
  subtractPerspectiveDepth: () => void;
  makePlayerStand: () => void;
  makePlayerWalk: (direction: DirectionVo) => void;
  changePlayerHeldItem: (item: ItemModel) => void;
  createUnit: () => void;
  removeUnit: () => void;
  rotateUnit: () => void;
  leaveWorld: () => void;
};

const Context = createContext<ContextValue>({
  worldJourney: null,
  connectionStatus: 'WAITING',
  items: null,
  enterWorld: () => {},
  addPerspectiveDepth: () => {},
  subtractPerspectiveDepth: () => {},
  makePlayerStand: () => {},
  makePlayerWalk: () => {},
  changePlayerHeldItem: () => {},
  createUnit: () => {},
  removeUnit: () => {},
  rotateUnit: () => {},
  leaveWorld: () => {},
});

type Props = {
  children: JSX.Element;
};

export function Provider({ children }: Props) {
  const [itemApiService] = useState<ItemApiService>(() => ItemApiService.new());
  const [items, setItems] = useState<ItemModel[] | null>([]);
  const [worldJourney, setWorldJourney] = useState<WorldJourney | null>(null);

  useEffect(() => {
    if (!worldJourney) return;

    worldJourney.subscribePlaceholderItemIdsAdded((placeholderItemIds) => {
      itemApiService.getItemsOfIds(placeholderItemIds).then((_items) => {
        _items.forEach((item) => {
          worldJourney.executeCommand(AddItemCommand.new(item));
        });
      });
    });
  }, [worldJourney]);

  const fetchItems = useCallback(async () => {
    const newItems = await itemApiService.getItems();
    setItems(newItems);
  }, []);
  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (!worldJourney || !items) return;
    items.forEach((item) => {
      worldJourney.executeCommand(AddItemCommand.new(item));
    });
  }, [worldJourney, items]);

  useEffect(() => {
    if (!worldJourney) return;

    worldJourney.subscribeMyPlayerChanged((oldPlayer, player) => {
      const oldPlayerPos = oldPlayer.getPosition();
      const playerPos = player.getPosition();
      if (oldPlayerPos.isEqual(playerPos)) {
        return;
      }

      const unitAtPlayerPos = worldJourney.getUnit(playerPos);
      if (!unitAtPlayerPos) return;

      if (unitAtPlayerPos instanceof PortalUnitModel) {
        worldJourney.executeCommand(SendPlayerIntoPortalCommand.new(player.getId(), playerPos));
      }
    });
  }, [worldJourney]);

  const worldJourneyApiService = useRef<WorldJourneyApiService | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('WAITING');

  const enterWorld = useCallback((WorldId: string) => {
    if (worldJourneyApiService.current) {
      return;
    }

    let newWorldJourney: WorldJourney | null = null;
    const newWorldJourneyApiService = WorldJourneyApiService.new(WorldId, {
      onWorldEntered: (_worldJourney) => {
        newWorldJourney = _worldJourney;
        setWorldJourney(_worldJourney);
      },
      onCommandSucceeded: (command) => {
        if (!newWorldJourney) return;
        newWorldJourney.executeCommand(command);
      },
      onErrored: () => {
        // TODO - do something
      },
      onOpen: () => {
        setConnectionStatus('OPEN');
      },
      onClose: () => {
        setConnectionStatus('DISCONNECTED');
        worldJourneyApiService.current = null;
      },
    });
    setConnectionStatus('CONNECTING');
    worldJourneyApiService.current = newWorldJourneyApiService;
  }, []);

  useEffect(() => {
    if (!worldJourney) return () => {};

    const intervalId = setInterval(() => {
      worldJourney.updatePlayerClientPositions();
    }, 100);

    return () => {
      clearInterval(intervalId);
    };
  }, [worldJourney]);

  const addPerspectiveDepth = useCallback(() => {
    if (!worldJourney) return;

    worldJourney.executeCommand(AddPerspectiveDepthCommand.new());
  }, [worldJourney]);

  const subtractPerspectiveDepth = useCallback(() => {
    if (!worldJourney) return;

    worldJourney.executeCommand(SubtractPerspectiveDepthCommand.new());
  }, [worldJourney]);

  useEffect(() => {
    // const currentWorldJourneyApiService = worldJourneyApiService.current;
    // if (!currentWorldJourneyApiService || !worldJourney) {
    //   return () => {};
    // }
    // return worldJourney.subscribeCommandExecuted((command) => {
    //   if (command instanceof MovePlayerCommand) {
    //     const myPlayer = worldJourney.getMyPlayer();
    //     if (command.getPlayerId() !== myPlayer.getId()) return;
    //     const playerId = myPlayer.getId();
    //     const newPos = myPlayer.getPosition();
    //     if (command.getPosition().isEqual(newPos)) return;
    //     const unitAtMyPlayerPos = worldJourney.getUnit(newPos);
    //     if (!unitAtMyPlayerPos) return;
    //     if (!unitAtMyPlayerPos.getType().isPortal()) return;
    //     const sendPlayerIntoPortalCommand = SendPlayerIntoPortalCommand.new(playerId, newPos);
    //     worldJourney.executeCommand(sendPlayerIntoPortalCommand);
    //     currentWorldJourneyApiService.sendCommand(sendPlayerIntoPortalCommand);
    //   }
    // });
  }, [worldJourney]);

  const makePlayerStand = useCallback(() => {
    if (!worldJourneyApiService.current || !worldJourney) {
      return;
    }

    const myPlayer = worldJourney.getMyPlayer();
    const playerPosition = myPlayer.getPosition();
    const playerDirection = worldJourney.getMyPlayer().getDirection();
    const playerAction = PlayerActionVo.newStand(playerPosition, playerDirection, DateVo.now());
    const command = ChangePlayerActionCommand.new(myPlayer.getId(), playerAction);
    worldJourney.executeCommand(command);
    worldJourneyApiService.current.sendCommand(command);
  }, [worldJourney]);

  const makePlayerWalk = useCallback(
    (direction: DirectionVo) => {
      if (!worldJourneyApiService.current || !worldJourney) {
        return;
      }

      const myPlayer = worldJourney.getMyPlayer();
      const playerPosition = myPlayer.getPosition();
      const playerAction = PlayerActionVo.newWalk(playerPosition, direction, DateVo.now());
      const command = ChangePlayerActionCommand.new(myPlayer.getId(), playerAction);
      worldJourney.executeCommand(command);
      worldJourneyApiService.current.sendCommand(command);
    },
    [worldJourney]
  );

  const leaveWorld = useCallback(() => {
    if (!worldJourneyApiService.current) {
      return;
    }
    setConnectionStatus('DISCONNECTING');
    worldJourneyApiService.current.disconnect();
  }, []);

  const changePlayerHeldItem = useCallback(
    (item: ItemModel) => {
      if (!worldJourney || !worldJourneyApiService.current) return;

      const command = ChangePlayerHeldItemCommand.new(worldJourney.getMyPlayer().getId(), item.getId());
      worldJourney.executeCommand(command);
      worldJourneyApiService.current.sendCommand(command);
    },
    [worldJourney]
  );

  const createStaticUnit = useCallback(
    (itemId: string, position: PositionVo, direction: DirectionVo) => {
      if (!worldJourney || !worldJourneyApiService.current) return;

      const command = CreateStaticUnitCommand.new(itemId, position, direction);
      worldJourney.executeCommand(command);
      worldJourneyApiService.current.sendCommand(command);
    },
    [worldJourney]
  );

  const createPortalUnit = useCallback(
    (itemId: string, position: PositionVo, direction: DirectionVo) => {
      if (!worldJourney || !worldJourneyApiService.current) return;

      const command = CreatePortalUnitCommand.new(itemId, position, direction);
      worldJourney.executeCommand(command);
      worldJourneyApiService.current.sendCommand(command);
    },
    [worldJourney]
  );

  const createUnit = useCallback(() => {
    if (!worldJourney) return;

    const myPlayerHeldItem = worldJourney.getMyPlayerHeldItem();
    if (!myPlayerHeldItem) return;

    const position = worldJourney.getMyPlayer().getFowardPos();
    const direction = worldJourney.getMyPlayer().getDirection().getOppositeDirection();

    const compatibleUnitType = myPlayerHeldItem.getCompatibleUnitType();
    if (compatibleUnitType.isStatic()) {
      createStaticUnit(myPlayerHeldItem.getId(), position, direction);
    } else if (compatibleUnitType.isPortal()) {
      createPortalUnit(myPlayerHeldItem.getId(), position, direction);
    }
  }, [worldJourney]);

  const removeUnit = useCallback(() => {
    if (!worldJourney || !worldJourneyApiService.current) return;

    const unitPos = worldJourney.getMyPlayer().getFowardPos();
    const unitAtPos = worldJourney.getUnit(unitPos);
    if (!unitAtPos) return;

    if (unitAtPos.getType().isStatic()) {
      const command = RemoveStaticUnitCommand.new(unitPos);
      worldJourney.executeCommand(command);
      worldJourneyApiService.current.sendCommand(command);
    } else if (unitAtPos.getType().isPortal()) {
      const command = RemovePortalUnitCommand.new(unitPos);
      worldJourney.executeCommand(command);
      worldJourneyApiService.current.sendCommand(command);
    }
  }, [worldJourney]);

  const rotateUnit = useCallback(() => {
    if (!worldJourney || !worldJourneyApiService.current) return;

    const unitPos = worldJourney.getMyPlayer().getFowardPos();
    const command = RotateUnitCommand.new(unitPos);
    worldJourney.executeCommand(command);
    worldJourneyApiService.current.sendCommand(command);
  }, [worldJourney]);

  return (
    <Context.Provider
      value={useMemo<ContextValue>(
        () => ({
          worldJourney,
          connectionStatus,
          items,
          enterWorld,
          addPerspectiveDepth,
          subtractPerspectiveDepth,
          makePlayerStand,
          makePlayerWalk,
          leaveWorld,
          changePlayerHeldItem,
          createUnit,
          removeUnit,
          rotateUnit,
        }),
        [
          worldJourney,
          connectionStatus,
          items,
          enterWorld,
          addPerspectiveDepth,
          subtractPerspectiveDepth,
          makePlayerStand,
          makePlayerWalk,
          leaveWorld,
          changePlayerHeldItem,
          createUnit,
          removeUnit,
          rotateUnit,
        ]
      )}
    >
      {children}
    </Context.Provider>
  );
}

export { Provider as WorldJourneyProvider, Context as WorldJourneyContext };
