import { createContext, useCallback, useRef, useState, useMemo, useEffect } from 'react';
import { WorldJourneyApiService } from '@/api-services/world-journey-api-service';
import { UnitModel, PlayerModel, DirectionModel, PositionModel, WorldModel, ItemModel } from '@/models';
import { ItemApiService } from '@/api-services/item-api-service';

type ConnectionStatus = 'WAITING' | 'CONNECTING' | 'OPEN' | 'DISCONNECTING' | 'DISCONNECTED';

type ContextValue = {
  connectionStatus: ConnectionStatus;
  world: WorldModel | null;
  myPlayer: PlayerModel | null;
  otherPlayers: PlayerModel[] | null;
  units: UnitModel[] | null;
  cameraDistance: number;
  items: ItemModel[] | null;
  enterWorld: (WorldId: string) => void;
  move: (direction: DirectionModel) => void;
  changeHeldItem: (itemId: string) => void;
  createUnit: () => void;
  removeUnit: () => void;
  leaveWorld: () => void;
  addCameraDistance: () => void;
  subtractCameraDistance: () => void;
};

function createInitialContextValue(): ContextValue {
  return {
    connectionStatus: 'WAITING',
    world: null,
    myPlayer: null,
    otherPlayers: null,
    units: null,
    cameraDistance: 30,
    items: null,
    enterWorld: () => {},
    move: () => {},
    changeHeldItem: () => {},
    createUnit: () => {},
    removeUnit: () => {},
    leaveWorld: () => {},
    addCameraDistance: () => {},
    subtractCameraDistance: () => {},
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

  const [world, setWorld] = useState<WorldModel | null>(null);
  const currentWorld = useRef<WorldModel | null>(null);
  useEffect(() => {
    currentWorld.current = world;
  }, [world]);

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

  const [cameraDistance, setCameraDistance] = useState<number>(initialContextValue.cameraDistance);

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
        setWorld(_world);
        setUnits(_units);
        setMyPlayerId(_myPlayerId);
        setPlayers(_players);
      },
      onUnitCreated: (_unit) => {
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

  const move = useCallback((direction: DirectionModel) => {
    if (
      !worldJourneyApiService.current ||
      !currentWorld.current ||
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
    if (!currentWorld.current.getBound().doesContainPosition(nextPosition)) {
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
  }, []);

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

  const createUnit = useCallback(() => {
    if (!worldJourneyApiService.current || !currentMyPlayer.current || !positionPlayersMap.current) return;

    const heldItemId = currentMyPlayer.current.getHeldItemid();
    if (!heldItemId) return;

    const itemPosition = currentMyPlayer.current.getPositionOneStepFoward();
    const doesPositionHavePlayers = positionPlayersMap.current[itemPosition.toString()];
    if (doesPositionHavePlayers) return;

    const itemDirection = currentMyPlayer.current.getDirection().getOppositeDirection();

    worldJourneyApiService.current.createUnit(heldItemId, itemPosition, itemDirection);
  }, []);

  const removeUnit = useCallback(() => {
    if (!currentMyPlayer.current) return;
    worldJourneyApiService.current?.removeUnit(currentMyPlayer.current.getPositionOneStepFoward());
  }, []);

  const addCameraDistance = useCallback(() => {
    setCameraDistance((val) => {
      if (val <= 15) return 15;
      return val - 15;
    });
  }, []);

  const subtractCameraDistance = useCallback(() => {
    setCameraDistance((val) => {
      if (val >= 90) return 90;
      return val + 15;
    });
  }, []);

  return (
    <Context.Provider
      value={useMemo<ContextValue>(
        () => ({
          connectionStatus,
          world,
          myPlayer,
          otherPlayers,
          units,
          cameraDistance,
          items,
          enterWorld,
          move,
          leaveWorld,
          changeHeldItem,
          createUnit,
          removeUnit,
          addCameraDistance,
          subtractCameraDistance,
        }),
        [
          connectionStatus,
          myPlayer,
          otherPlayers,
          units,
          cameraDistance,
          items,
          enterWorld,
          move,
          changeHeldItem,
          createUnit,
          leaveWorld,
          addCameraDistance,
          subtractCameraDistance,
        ]
      )}
    >
      {children}
    </Context.Provider>
  );
}

export { Provider as WorldJourneyProvider, Context as WorldJourneyContext };
