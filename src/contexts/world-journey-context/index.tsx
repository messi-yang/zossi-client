import { createContext, useCallback, useRef, useState, useMemo, useEffect } from 'react';
import { WorldJourneyApiService } from '@/apis/services/world-journey-api-service';
import { ItemApiService } from '@/apis/services/item-api-service';
import { ItemModel } from '@/models/world/item-model';
import { DirectionModel } from '@/models/world/direction-model';
import {
  AddItemCommand,
  AddUnitCommand,
  RemoveUnitCommand,
  UpdatePlayerCommand,
} from '@/logics/world-journey/commands';
import { WorldJourney } from '@/logics/world-journey';
import { RotateUnitCommand } from '@/logics/world-journey/commands/rotate-unit-command';
import { ChangePlayerHeldItemCommand } from '@/logics/world-journey/commands/change-player-held-item-command';

type ConnectionStatus = 'WAITING' | 'CONNECTING' | 'OPEN' | 'DISCONNECTING' | 'DISCONNECTED';

type ContextValue = {
  worldJourney: WorldJourney | null;
  connectionStatus: ConnectionStatus;
  items: ItemModel[] | null;
  enterWorld: (WorldId: string) => void;
  move: (direction: DirectionModel) => void;
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
  move: () => {},
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
      onUnitCreated: (_unit) => {
        if (!newWorldJourney) return;
        newWorldJourney.execute(AddUnitCommand.new(_unit));
      },
      onUnitRotated: (command) => {
        if (!newWorldJourney) return;
        newWorldJourney.execute(command);
      },
      onUnitRemoved(command) {
        if (!newWorldJourney) return;
        newWorldJourney.execute(command);
      },
      onPlayerJoined: (command) => {
        if (!newWorldJourney) return;
        newWorldJourney.execute(command);
      },
      onPlayerMoved: (_player) => {
        if (!newWorldJourney) return;
        newWorldJourney.execute(UpdatePlayerCommand.new(_player));
      },
      onPlayerHeldItemChanged: (command) => {
        if (!newWorldJourney) return;
        newWorldJourney.execute(command);
      },
      onPlayerLeft: (command) => {
        if (!newWorldJourney) return;
        newWorldJourney.execute(command);
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

  const move = useCallback(
    (direction: DirectionModel) => {
      if (!worldJourneyApiService.current || !worldJourney) {
        return;
      }

      const playerIsMovingFoward = worldJourney.getMyPlayer().getDirection().isEqual(direction);
      if (!playerIsMovingFoward) {
        worldJourneyApiService.current.move(direction);
        return;
      }

      const nextPosition = worldJourney.getMyPlayer().getPositionOneStepFoward();
      if (!worldJourney.getWorldBound().doesContainPosition(nextPosition)) {
        return;
      }

      const unitAtNextPosition = worldJourney.getUnit(nextPosition);
      if (unitAtNextPosition) {
        const item = worldJourney.getItem(unitAtNextPosition.getItemId());
        if (!item) return;
        if (!item.getTraversable()) return;
      }
      worldJourneyApiService.current.move(direction);
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
      worldJourneyApiService.current.changePlayerHeldItem(command);
    },
    [worldJourney]
  );

  const createStaticUnit = useCallback(() => {
    if (!worldJourney || !worldJourneyApiService.current) return;

    const heldItemId = worldJourney.getMyPlayer().getHeldItemId();
    if (!heldItemId) return;

    const itemPosition = worldJourney.getMyPlayer().getPositionOneStepFoward();
    const doesPositionHavePlayers = worldJourney.doesPosHavePlayers(itemPosition);
    if (doesPositionHavePlayers) return;

    const itemDirection = worldJourney.getMyPlayer().getDirection().getOppositeDirection();

    worldJourneyApiService.current.createStaticUnit(heldItemId, itemPosition, itemDirection);
  }, [worldJourney]);

  const createPortalUnit = useCallback(() => {
    if (!worldJourney || !worldJourneyApiService.current) return;

    const heldItemId = worldJourney.getMyPlayer().getHeldItemId();
    if (!heldItemId) return;

    const itemPosition = worldJourney.getMyPlayer().getPositionOneStepFoward();

    const doesPositionHavePlayers = worldJourney.doesPosHavePlayers(itemPosition);
    if (doesPositionHavePlayers) return;
    const itemDirection = worldJourney.getMyPlayer().getDirection().getOppositeDirection();

    worldJourneyApiService.current.createPortalUnit(heldItemId, itemPosition, itemDirection);
  }, [worldJourney]);

  const createUnit = useCallback(() => {
    if (!worldJourney) return;

    const myPlayerHeldItem = worldJourney.getMyPlayerHeldItem();
    if (!myPlayerHeldItem) return;

    const compatibleUnitType = myPlayerHeldItem.getCompatibleUnitType();
    if (compatibleUnitType.isStatic()) {
      createStaticUnit();
    } else if (compatibleUnitType.isPortal()) {
      createPortalUnit();
    }
  }, [worldJourney]);

  const removeUnit = useCallback(() => {
    if (!worldJourney || !worldJourneyApiService.current) return;

    const unitPos = worldJourney.getMyPlayer().getPositionOneStepFoward();
    const command = RemoveUnitCommand.new(unitPos);
    const succeeded = worldJourney.execute(command);
    if (succeeded) {
      worldJourneyApiService.current.removeUnit(command);
    }
  }, [worldJourney]);

  const rotateUnit = useCallback(() => {
    if (!worldJourney || !worldJourneyApiService.current) return;

    const unitPos = worldJourney.getMyPlayer().getPositionOneStepFoward();
    const command = RotateUnitCommand.new(unitPos);
    const succeeded = worldJourney.execute(command);
    if (succeeded) {
      worldJourneyApiService.current.rotateUnit(command);
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
          move,
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
          move,
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
