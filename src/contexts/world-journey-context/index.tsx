import { createContext, useCallback, useRef, useState, useMemo, useEffect } from 'react';
import { WorldJourneyApiService } from '@/apis/services/world-journey-api-service';
import { PlayerModel } from '@/models/world/player-model';
import { UnitModel } from '@/models/world/unit-model';
import { ItemApiService } from '@/apis/services/item-api-service';
import { ItemModel } from '@/models/world/item-model';
import { PositionModel } from '@/models/world/position-model';
import { DirectionModel } from '@/models/world/direction-model';
import { WorldJourneyManager } from '@/managers/world-journey-manager';

type ConnectionStatus = 'WAITING' | 'CONNECTING' | 'OPEN' | 'DISCONNECTING' | 'DISCONNECTED';

type ContextValue = {
  worldJourneyManager: WorldJourneyManager | null;
  connectionStatus: ConnectionStatus;
  units: UnitModel[] | null;
  items: ItemModel[] | null;
  enterWorld: (WorldId: string) => void;
  move: (direction: DirectionModel) => void;
  changeHeldItem: (itemId: string) => void;
  createUnit: () => void;
  removeUnit: () => void;
  rotateUnit: () => void;
  leaveWorld: () => void;
};

function createInitialContextValue(): ContextValue {
  return {
    worldJourneyManager: null,
    connectionStatus: 'WAITING',
    units: null,
    items: null,
    enterWorld: () => {},
    move: () => {},
    changeHeldItem: () => {},
    createUnit: () => {},
    removeUnit: () => {},
    rotateUnit: () => {},
    leaveWorld: () => {},
  };
}

const Context = createContext<ContextValue>(createInitialContextValue());

type Props = {
  children: JSX.Element;
};

export function Provider({ children }: Props) {
  const initialContextValue = createInitialContextValue();

  const [itemApiService] = useState<ItemApiService>(() => ItemApiService.new());
  const [items, setItems] = useState<ItemModel[] | null>(initialContextValue.items);
  const [worldJourneyManager, setWorldJourneyManager] = useState<WorldJourneyManager | null>(null);

  useEffect(() => {
    if (!worldJourneyManager) return;

    itemApiService.getItemsOfIds(worldJourneyManager.getAppearingItemIds()).then((appearingItems) => {
      appearingItems.forEach((item) => {
        worldJourneyManager.addAppearingItem(item);
      });
    });
  }, [worldJourneyManager]);

  const fetchItems = useCallback(async () => {
    const newItems = await itemApiService.getItems();
    setItems(newItems);
  }, []);
  useEffect(() => {
    fetchItems();
  }, []);

  const worldJourneyApiService = useRef<WorldJourneyApiService | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('WAITING');

  const [units, setUnits] = useState<UnitModel[] | null>(initialContextValue.units);

  const positionUnitMap = useRef<Record<string, UnitModel | undefined> | null>(null);
  useEffect(() => {
    if (!units) {
      positionUnitMap.current = null;
      return;
    }

    const result: Record<string, UnitModel | undefined> = {};
    units.forEach((unit) => {
      result[unit.getPosition().toString()] = unit;
    });
    positionUnitMap.current = result;
  }, [units]);

  const [players, setPlayers] = useState<PlayerModel[] | null>([]);
  const positionPlayersMap = useRef<Record<string, PlayerModel[] | undefined> | null>(null);
  useEffect(() => {
    if (!players) {
      positionPlayersMap.current = null;
      return;
    }
    const result: Record<string, PlayerModel[] | undefined> = {};
    players.forEach((player) => {
      const positionString = player.getPosition().toString();
      const playersAtPosition = result[positionString];
      if (!playersAtPosition) {
        result[positionString] = [player];
      } else {
        playersAtPosition.push(player);
      }
    });
    positionPlayersMap.current = result;
  }, [players]);

  const reset = useCallback(() => {
    setPlayers([]);
    setUnits(initialContextValue.units);
  }, []);

  const removeUnitFromUnits = useCallback((position: PositionModel) => {
    setUnits((_units) => {
      if (!_units) return null;
      return _units.filter((_unit) => !_unit.getPosition().isEqual(position));
    });
  }, []);

  const addUnitToUnits = useCallback((unit: UnitModel) => {
    setUnits((_units) => {
      if (!_units) return null;
      return [..._units, unit];
    });
  }, []);

  const removePlayerFromPlayers = useCallback((playerId: string) => {
    setPlayers((_players) => {
      if (!_players) return null;
      return _players.filter((_player) => _player.getId() !== playerId);
    });
  }, []);

  const addPlayerToPlayers = useCallback((player: PlayerModel) => {
    setPlayers((_players) => {
      if (!_players) return null;
      return [..._players, player];
    });
  }, []);

  const enterWorld = useCallback((WorldId: string) => {
    if (worldJourneyApiService.current) {
      return;
    }

    let newWorldJourneyManager: WorldJourneyManager | null = null;
    const newWorldJourneyApiService = WorldJourneyApiService.new(WorldId, {
      onWorldEntered: (_world, _units, _myPlayerId, _players) => {
        setUnits(_units);
        setPlayers(_players);

        newWorldJourneyManager = WorldJourneyManager.new(_world, _players, _myPlayerId, _units);
        setWorldJourneyManager(newWorldJourneyManager);
      },
      onUnitCreated: (_unit) => {
        removeUnitFromUnits(_unit.getPosition());
        addUnitToUnits(_unit);
      },
      onUnitUpdated: (_unit) => {
        removeUnitFromUnits(_unit.getPosition());
        addUnitToUnits(_unit);
      },
      onUnitDeleted(_position) {
        removeUnitFromUnits(_position);
      },
      onPlayerJoined: (_player) => {
        removePlayerFromPlayers(_player.getId());
        addPlayerToPlayers(_player);

        if (!newWorldJourneyManager) return;
        newWorldJourneyManager.addPlayer(_player);
      },
      onPlayerMoved: (_player) => {
        removePlayerFromPlayers(_player.getId());
        addPlayerToPlayers(_player);

        if (!newWorldJourneyManager) return;
        newWorldJourneyManager.updatePlayer(_player);
      },
      onPlayerLeft: (_playerId) => {
        removePlayerFromPlayers(_playerId);

        if (!newWorldJourneyManager) return;
        newWorldJourneyManager.removePlayer(_playerId);
      },
      onUnitsUpdated: (_units: UnitModel[]) => {
        setUnits(_units);
      },
      onOpen: () => {
        setConnectionStatus('OPEN');
      },
      onClose: () => {
        setConnectionStatus('DISCONNECTED');
        worldJourneyApiService.current = null;
        reset();
      },
    });
    setConnectionStatus('CONNECTING');
    worldJourneyApiService.current = newWorldJourneyApiService;
  }, []);

  const move = useCallback(
    (direction: DirectionModel) => {
      if (!worldJourneyApiService.current || !worldJourneyManager || !positionUnitMap.current) {
        return;
      }

      const playerIsMovingFoward = worldJourneyManager.getMyPlayer().getDirection().isEqual(direction);
      if (!playerIsMovingFoward) {
        worldJourneyApiService.current.move(direction);
        return;
      }

      const nextPosition = worldJourneyManager.getMyPlayer().getPositionOneStepFoward();
      if (!worldJourneyManager.getWorldBound().doesContainPosition(nextPosition)) {
        return;
      }

      const unitAtNextPosition = positionUnitMap.current[nextPosition.toString()];
      if (unitAtNextPosition) {
        const item = worldJourneyManager.getAppearingItem(unitAtNextPosition.getItemId());
        if (!item) return;
        if (!item.getTraversable()) return;
      }
      worldJourneyApiService.current.move(direction);
    },
    [worldJourneyManager]
  );

  const leaveWorld = useCallback(() => {
    if (!worldJourneyApiService.current) {
      return;
    }
    setConnectionStatus('DISCONNECTING');
    worldJourneyApiService.current.disconnect();
  }, []);

  const changeHeldItem = useCallback((itemId: string) => {
    worldJourneyApiService.current?.changeHeldItem(itemId);
  }, []);

  const createStaticUnit = useCallback(() => {
    if (!worldJourneyManager || !worldJourneyApiService.current || !positionPlayersMap.current) return;

    const heldItemId = worldJourneyManager.getMyPlayer().getHeldItemId();
    if (!heldItemId) return;

    const itemPosition = worldJourneyManager.getMyPlayer().getPositionOneStepFoward();
    const doesPositionHavePlayers = positionPlayersMap.current[itemPosition.toString()];
    if (doesPositionHavePlayers) return;

    const itemDirection = worldJourneyManager.getMyPlayer().getDirection().getOppositeDirection();

    worldJourneyApiService.current.createStaticUnit(heldItemId, itemPosition, itemDirection);
  }, [worldJourneyManager]);

  const createPortalUnit = useCallback(() => {
    if (!worldJourneyManager || !worldJourneyApiService.current || !positionPlayersMap.current) return;

    const heldItemId = worldJourneyManager.getMyPlayer().getHeldItemId();
    if (!heldItemId) return;

    const itemPosition = worldJourneyManager.getMyPlayer().getPositionOneStepFoward();

    const doesPositionHavePlayers = positionPlayersMap.current[itemPosition.toString()];
    if (doesPositionHavePlayers) return;
    const itemDirection = worldJourneyManager.getMyPlayer().getDirection().getOppositeDirection();

    worldJourneyApiService.current.createPortalUnit(heldItemId, itemPosition, itemDirection);
  }, [worldJourneyManager]);

  const createUnit = useCallback(() => {
    if (!worldJourneyManager) return;

    const myPlayerHeldItem = worldJourneyManager.getMyPlayerHeldItem() || null;
    if (!myPlayerHeldItem) return;

    const compatibleUnitType = myPlayerHeldItem.getCompatibleUnitType();
    if (compatibleUnitType.isStatic()) {
      createStaticUnit();
    } else if (compatibleUnitType.isPortal()) {
      createPortalUnit();
    }
  }, [worldJourneyManager]);

  const removeUnit = useCallback(() => {
    if (!worldJourneyManager) return;
    worldJourneyApiService.current?.removeUnit(worldJourneyManager.getMyPlayer().getPositionOneStepFoward());
  }, [worldJourneyManager]);

  const rotateUnit = useCallback(() => {
    if (!worldJourneyManager) return;
    worldJourneyApiService.current?.rotateUnit(worldJourneyManager.getMyPlayer().getPositionOneStepFoward());
  }, [worldJourneyManager]);

  return (
    <Context.Provider
      value={useMemo<ContextValue>(
        () => ({
          worldJourneyManager,
          connectionStatus,
          units,
          items,
          enterWorld,
          move,
          leaveWorld,
          changeHeldItem,
          createUnit,
          removeUnit,
          rotateUnit,
        }),
        [
          worldJourneyManager,
          connectionStatus,
          units,
          items,
          enterWorld,
          move,
          leaveWorld,
          changeHeldItem,
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
