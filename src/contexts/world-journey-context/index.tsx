import { createContext, useCallback, useRef, useState, useMemo, useEffect } from 'react';
import { WorldJourneyApi } from '@/apis/world-journey-api';
import { ItemApi } from '@/apis/item-api';
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
  const [itemApi] = useState<ItemApi>(() => ItemApi.new());
  const [items, setItems] = useState<ItemModel[] | null>([]);
  const [worldJourney, setWorldJourney] = useState<WorldJourney | null>(null);

  useEffect(() => {
    if (!worldJourney) return;

    worldJourney.subscribePlaceholderItemIdsAdded((placeholderItemIds) => {
      itemApi.getItemsOfIds(placeholderItemIds).then((_items) => {
        _items.forEach((item) => {
          worldJourney.executeCommand(AddItemCommand.new(item));
        });
      });
    });
  }, [worldJourney]);

  const fetchItems = useCallback(async () => {
    const newItems = await itemApi.getItems();
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

  const worldJourneyApi = useRef<WorldJourneyApi | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('WAITING');

  const enterWorld = useCallback((WorldId: string) => {
    if (worldJourneyApi.current) {
      return;
    }

    let newWorldJourney: WorldJourney | null = null;
    const newWorldJourneyApi = WorldJourneyApi.new(WorldId, {
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
        worldJourneyApi.current = null;
      },
    });
    setConnectionStatus('CONNECTING');
    worldJourneyApi.current = newWorldJourneyApi;
  }, []);

  useEffect(() => {
    if (!worldJourney) return;

    worldJourney.subscribeMyPlayerChanged((oldPlayer, player) => {
      if (!worldJourneyApi.current) return;

      const oldPlayerPos = oldPlayer.getPosition();
      const playerPos = player.getPosition();
      if (oldPlayerPos.isEqual(playerPos)) {
        return;
      }

      const unitAtPlayerPos = worldJourney.getUnit(playerPos);
      if (!unitAtPlayerPos) return;

      if (unitAtPlayerPos instanceof PortalUnitModel) {
        const command = SendPlayerIntoPortalCommand.new(player.getId(), playerPos);
        worldJourney.executeCommand(command);
        worldJourneyApi.current.sendCommand(command);
      }
    });
  }, [worldJourney]);

  // useEffect(() => {
  //   if (!worldJourney) return () => {};

  //   const intervalId = setInterval(() => {
  //     console.log('!');
  //     worldJourney.updatePlayerClientPositions();
  //   }, 16);

  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, [worldJourney]);

  useEffect(() => {
    const maxFPS = 20;
    const frameDelay = 1000 / maxFPS;
    let lastFrameTime = 0;

    let animateId: number | null = null;
    function animate() {
      if (!worldJourney) return;

      const currentTime = performance.now();
      const elapsed = currentTime - lastFrameTime;
      if (elapsed > frameDelay) {
        worldJourney.updatePlayerClientPositions();
        lastFrameTime = currentTime - (elapsed % frameDelay);
      }
      animateId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      if (animateId !== null) {
        cancelAnimationFrame(animateId);
      }
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
    // const currentWorldJourneyApi = worldJourneyApi.current;
    // if (!currentWorldJourneyApi || !worldJourney) {
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
    //     currentWorldJourneyApi.sendCommand(sendPlayerIntoPortalCommand);
    //   }
    // });
  }, [worldJourney]);

  const makePlayerStand = useCallback(() => {
    if (!worldJourneyApi.current || !worldJourney) {
      return;
    }

    const myPlayer = worldJourney.getMyPlayer();
    const playerPrecisePosition = myPlayer.getPrecisePosition();
    const playerDirection = worldJourney.getMyPlayer().getDirection();
    const playerAction = PlayerActionVo.newStand(playerPrecisePosition, playerDirection, DateVo.now());
    const command = ChangePlayerActionCommand.new(myPlayer.getId(), playerAction);
    worldJourney.executeCommand(command);
    worldJourneyApi.current.sendCommand(command);
  }, [worldJourney]);

  const makePlayerWalk = useCallback(
    (direction: DirectionVo) => {
      if (!worldJourneyApi.current || !worldJourney) {
        return;
      }

      const myPlayer = worldJourney.getMyPlayer();
      const playerPrecisePosition = myPlayer.getPrecisePosition();
      const playerAction = PlayerActionVo.newWalk(playerPrecisePosition, direction, DateVo.now());
      const command = ChangePlayerActionCommand.new(myPlayer.getId(), playerAction);
      worldJourney.executeCommand(command);
      worldJourneyApi.current.sendCommand(command);
    },
    [worldJourney]
  );

  const leaveWorld = useCallback(() => {
    if (!worldJourneyApi.current) {
      return;
    }
    setConnectionStatus('DISCONNECTING');
    worldJourneyApi.current.disconnect();
  }, []);

  const changePlayerHeldItem = useCallback(
    (item: ItemModel) => {
      if (!worldJourney || !worldJourneyApi.current) return;

      const command = ChangePlayerHeldItemCommand.new(worldJourney.getMyPlayer().getId(), item.getId());
      worldJourney.executeCommand(command);
      worldJourneyApi.current.sendCommand(command);
    },
    [worldJourney]
  );

  const createStaticUnit = useCallback(
    (itemId: string, position: PositionVo, direction: DirectionVo) => {
      if (!worldJourney || !worldJourneyApi.current) return;

      const command = CreateStaticUnitCommand.new(itemId, position, direction);
      worldJourney.executeCommand(command);
      worldJourneyApi.current.sendCommand(command);
    },
    [worldJourney]
  );

  const createPortalUnit = useCallback(
    (itemId: string, position: PositionVo, direction: DirectionVo) => {
      if (!worldJourney || !worldJourneyApi.current) return;

      const command = CreatePortalUnitCommand.new(itemId, position, direction);
      worldJourney.executeCommand(command);
      worldJourneyApi.current.sendCommand(command);
    },
    [worldJourney]
  );

  const createUnit = useCallback(() => {
    if (!worldJourney) return;

    const myPlayerHeldItem = worldJourney.getMyPlayerHeldItem();
    if (!myPlayerHeldItem) return;

    const myPlayer = worldJourney.getMyPlayer();
    const unitPos = myPlayer.getFowardPosition(1);
    const direction = myPlayer.getDirection().getOppositeDirection();

    const compatibleUnitType = myPlayerHeldItem.getCompatibleUnitType();
    if (compatibleUnitType.isStatic()) {
      createStaticUnit(myPlayerHeldItem.getId(), unitPos, direction);
    } else if (compatibleUnitType.isPortal()) {
      createPortalUnit(myPlayerHeldItem.getId(), unitPos, direction);
    }
  }, [worldJourney]);

  const removeUnit = useCallback(() => {
    if (!worldJourney || !worldJourneyApi.current) return;

    const myPlayer = worldJourney.getMyPlayer();
    const unitPos = myPlayer.getFowardPosition(1);
    const unitAtPos = worldJourney.getUnit(unitPos);
    if (!unitAtPos) return;

    if (unitAtPos.getType().isStatic()) {
      const command = RemoveStaticUnitCommand.new(unitPos);
      worldJourney.executeCommand(command);
      worldJourneyApi.current.sendCommand(command);
    } else if (unitAtPos.getType().isPortal()) {
      const command = RemovePortalUnitCommand.new(unitPos);
      worldJourney.executeCommand(command);
      worldJourneyApi.current.sendCommand(command);
    }
  }, [worldJourney]);

  const rotateUnit = useCallback(() => {
    if (!worldJourney || !worldJourneyApi.current) return;

    const myPlayer = worldJourney.getMyPlayer();
    const unitPos = myPlayer.getFowardPosition(1);
    const command = RotateUnitCommand.new(unitPos);
    worldJourney.executeCommand(command);
    worldJourneyApi.current.sendCommand(command);
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
