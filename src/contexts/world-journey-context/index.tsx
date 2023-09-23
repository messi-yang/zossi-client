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
  myPlayer: PlayerModel | null;
  otherPlayers: PlayerModel[] | null;
  units: UnitModel[] | null;
  items: ItemModel[] | null;
  playerHeldItem: ItemModel | null;
  enterWorld: (WorldId: string) => void;
  move: (direction: DirectionModel) => void;
  changeHeldItem: (itemId: string) => void;
  createStaticUnit: () => void;
  createPortalUnit: () => void;
  removeUnit: () => void;
  rotateUnit: () => void;
  leaveWorld: () => void;
};

function createInitialContextValue(): ContextValue {
  return {
    worldJourneyManager: null,
    connectionStatus: 'WAITING',
    myPlayer: null,
    otherPlayers: null,
    units: null,
    items: null,
    playerHeldItem: null,
    enterWorld: () => {},
    move: () => {},
    changeHeldItem: () => {},
    createStaticUnit: () => {},
    createPortalUnit: () => {},
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

  const itemMap = useRef<Record<string, ItemModel | undefined> | null>({});
  useEffect(() => {
    if (!items) {
      itemMap.current = null;
      return;
    }

    const result: Record<string, ItemModel | undefined> = {};
    items.forEach((item) => {
      result[item.getId()] = item;
    });
    itemMap.current = result;
  }, [items]);

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

  const [myPlayerId, setMyPlayerId] = useState<string | null>(null);
  const myPlayer = useMemo(() => {
    if (!players || !myPlayerId) return null;
    return players.find((p) => p.getId() === myPlayerId) || null;
  }, [players, myPlayerId]);

  const currentMyPlayer = useRef<PlayerModel | null>(null);
  useEffect(() => {
    currentMyPlayer.current = myPlayer;
  }, [myPlayer]);

  const otherPlayers = useMemo(() => {
    if (!players || !myPlayerId) return null;
    return players.filter((p) => p.getId() !== myPlayerId);
  }, [players, myPlayerId]);

  const playerHeldItem = useMemo(() => {
    if (!items || !myPlayer) return null;

    const heldItemId = myPlayer.getHeldItemid();
    if (!heldItemId) return null;

    return items.find((item) => item.getId() === heldItemId) || null;
  }, [items, myPlayer]);

  const reset = useCallback(() => {
    setMyPlayerId(null);
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

    const newWorldJourneyApiService = WorldJourneyApiService.new(WorldId, {
      onWorldEntered: (_world, _units, _myPlayerId, _players) => {
        setUnits(_units);
        setMyPlayerId(_myPlayerId);
        setPlayers(_players);

        const newMyPlayer = _players.find((p) => p.getId() === _myPlayerId);
        const newOtherPlayers = _players.filter((p) => p.getId() !== _myPlayerId);
        if (!newMyPlayer) return;

        const newWorldJourneyManager = WorldJourneyManager.new(_world, newOtherPlayers, newMyPlayer, _units);
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
      },
      onPlayerMoved: (_player) => {
        removePlayerFromPlayers(_player.getId());
        addPlayerToPlayers(_player);
      },
      onPlayerLeft: (_playerId) => {
        removePlayerFromPlayers(_playerId);
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
      if (
        !worldJourneyApiService.current ||
        !worldJourneyManager ||
        !currentMyPlayer.current ||
        !positionUnitMap.current ||
        !itemMap.current
      ) {
        return;
      }

      const playerIsMovingFoward = currentMyPlayer.current.getDirection().isEqual(direction);
      if (!playerIsMovingFoward) {
        worldJourneyApiService.current.move(direction);
        return;
      }

      const nextPosition = currentMyPlayer.current.getPositionOneStepFoward();
      if (!worldJourneyManager.getWorldBound().doesContainPosition(nextPosition)) {
        return;
      }

      const unitAtNextPosition = positionUnitMap.current[nextPosition.toString()];
      if (unitAtNextPosition) {
        const item = itemMap.current[unitAtNextPosition.getItemId()];
        if (item && !item.getTraversable()) {
          return;
        }
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
    if (!worldJourneyApiService.current || !currentMyPlayer.current || !positionPlayersMap.current) return;

    const heldItemId = currentMyPlayer.current.getHeldItemid();
    if (!heldItemId) return;

    const itemPosition = currentMyPlayer.current.getPositionOneStepFoward();
    const doesPositionHavePlayers = positionPlayersMap.current[itemPosition.toString()];
    if (doesPositionHavePlayers) return;

    const itemDirection = currentMyPlayer.current.getDirection().getOppositeDirection();

    worldJourneyApiService.current.createStaticUnit(heldItemId, itemPosition, itemDirection);
  }, []);

  const createPortalUnit = useCallback(() => {
    if (!worldJourneyApiService.current || !currentMyPlayer.current || !positionPlayersMap.current) return;

    const heldItemId = currentMyPlayer.current.getHeldItemid();
    if (!heldItemId) return;

    const itemPosition = currentMyPlayer.current.getPositionOneStepFoward();

    const doesPositionHavePlayers = positionPlayersMap.current[itemPosition.toString()];
    if (doesPositionHavePlayers) return;
    const itemDirection = currentMyPlayer.current.getDirection().getOppositeDirection();

    worldJourneyApiService.current.createPortalUnit(heldItemId, itemPosition, itemDirection);
  }, []);

  const removeUnit = useCallback(() => {
    if (!currentMyPlayer.current) return;
    worldJourneyApiService.current?.removeUnit(currentMyPlayer.current.getPositionOneStepFoward());
  }, []);

  const rotateUnit = useCallback(() => {
    if (!currentMyPlayer.current) return;
    worldJourneyApiService.current?.rotateUnit(currentMyPlayer.current.getPositionOneStepFoward());
  }, []);

  return (
    <Context.Provider
      value={useMemo<ContextValue>(
        () => ({
          worldJourneyManager,
          connectionStatus,
          myPlayer,
          otherPlayers,
          units,
          items,
          playerHeldItem,
          enterWorld,
          move,
          leaveWorld,
          changeHeldItem,
          createStaticUnit,
          createPortalUnit,
          removeUnit,
          rotateUnit,
        }),
        [
          worldJourneyManager,
          connectionStatus,
          myPlayer,
          otherPlayers,
          units,
          items,
          enterWorld,
          move,
          changeHeldItem,
          createStaticUnit,
          leaveWorld,
        ]
      )}
    >
      {children}
    </Context.Provider>
  );
}

export { Provider as WorldJourneyProvider, Context as WorldJourneyContext };
