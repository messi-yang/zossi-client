import { createContext, useCallback, useRef, useState, useMemo, useEffect } from 'react';
import { WorldJourneyApiService } from '@/apis/services/world-journey-api-service';
import { ItemApiService } from '@/apis/services/item-api-service';
import { ItemModel } from '@/models/world/item-model';
import { DirectionModel } from '@/models/world/direction-model';
import {
  AddItemCommand,
  RotateUnitCommand,
  RemoveUnitCommand,
  ChangePlayerHeldItemCommand,
  MovePlayerCommand,
  CreateStaticUnitCommand,
  CreatePortalUnitCommand,
} from '@/logics/world-journey/commands';
import { WorldJourney } from '@/logics/world-journey';
import { PositionModel } from '@/models/world/position-model';
import { SendPlayerIntoPortalCommand } from '@/logics/world-journey/commands/send-player-into-portal-command';

type ConnectionStatus = 'WAITING' | 'CONNECTING' | 'OPEN' | 'DISCONNECTING' | 'DISCONNECTED';

type ContextValue = {
  worldJourney: WorldJourney | null;
  connectionStatus: ConnectionStatus;
  items: ItemModel[] | null;
  enterWorld: (WorldId: string) => void;
  movePlayer: (direction: DirectionModel) => void;
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
  movePlayer: () => {},
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
          worldJourney.execute(AddItemCommand.new(item));
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
      worldJourney.execute(AddItemCommand.new(item));
    });
  }, [worldJourney, items]);

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
        newWorldJourney.execute(command);
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

  const movePlayer = useCallback(
    (direction: DirectionModel) => {
      if (!worldJourneyApiService.current || !worldJourney) {
        return;
      }

      const playerId = worldJourney.getMyPlayer().getId();
      const playerPosition = worldJourney.getMyPlayer().getPosition();
      const command = MovePlayerCommand.new(playerId, playerPosition, direction);
      const succeeded = worldJourney.execute(command);
      if (!succeeded) return;
      worldJourneyApiService.current.sendCommand(command);

      const newPlayerPosition = worldJourney.getMyPlayer().getPosition();
      if (playerPosition.isEqual(newPlayerPosition)) return;

      const unit = worldJourney.getUnit(newPlayerPosition);
      if (unit && unit.getType().isPortal()) {
        const secondCommand = SendPlayerIntoPortalCommand.new(playerId, newPlayerPosition);
        worldJourney.execute(secondCommand);
        worldJourneyApiService.current.sendCommand(secondCommand);
      }
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
      worldJourney.execute(command);
      worldJourneyApiService.current.sendCommand(command);
    },
    [worldJourney]
  );

  const createStaticUnit = useCallback(
    (itemId: string, position: PositionModel, direction: DirectionModel) => {
      if (!worldJourney || !worldJourneyApiService.current) return;

      const command = CreateStaticUnitCommand.new(itemId, position, direction);
      const succeeded = worldJourney.execute(command);
      if (succeeded) {
        worldJourneyApiService.current.sendCommand(command);
      }
    },
    [worldJourney]
  );

  const createPortalUnit = useCallback(
    (itemId: string, position: PositionModel, direction: DirectionModel) => {
      if (!worldJourney || !worldJourneyApiService.current) return;

      const command = CreatePortalUnitCommand.new(itemId, position, direction);
      const succeeded = worldJourney.execute(command);
      if (succeeded) {
        worldJourneyApiService.current.sendCommand(command);
      }
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
    const command = RemoveUnitCommand.new(unitPos);
    const succeeded = worldJourney.execute(command);
    if (succeeded) {
      worldJourneyApiService.current.sendCommand(command);
    }
  }, [worldJourney]);

  const rotateUnit = useCallback(() => {
    if (!worldJourney || !worldJourneyApiService.current) return;

    const unitPos = worldJourney.getMyPlayer().getFowardPos();
    const command = RotateUnitCommand.new(unitPos);
    const succeeded = worldJourney.execute(command);
    if (succeeded) {
      worldJourneyApiService.current.sendCommand(command);
    }
  }, [worldJourney]);

  return (
    <Context.Provider
      value={useMemo<ContextValue>(
        () => ({
          worldJourney,
          connectionStatus,
          items,
          enterWorld,
          movePlayer,
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
          movePlayer,
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
