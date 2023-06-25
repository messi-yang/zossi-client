import { createContext, useCallback, useRef, useState, useMemo } from 'react';
import { WorldJourneyApiService } from '@/api-services/world-journey-api-service';
import { UnitModel, PlayerModel, DirectionModel, PositionModel, WorldModel } from '@/models';

type ConnectionStatus = 'WAITING' | 'CONNECTING' | 'OPEN' | 'DISCONNECTING' | 'DISCONNECTED';

type ContextValue = {
  connectionStatus: ConnectionStatus;
  world: WorldModel | null;
  myPlayer: PlayerModel | null;
  otherPlayers: PlayerModel[] | null;
  units: UnitModel[] | null;
  cameraDistance: number;
  enterWorld: (WorldId: string) => void;
  move: (direction: DirectionModel) => void;
  changeHeldItem: (itemId: string) => void;
  placeItem: () => void;
  removeItem: () => void;
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
    enterWorld: () => {},
    move: () => {},
    changeHeldItem: () => {},
    placeItem: () => {},
    removeItem: () => {},
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
  const worldJourneyApiService = useRef<WorldJourneyApiService | null>(null);

  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('WAITING');
  const initialContextValue = createInitialContextValue();
  const [world, setWorld] = useState<WorldModel | null>(null);
  const [myPlayerId, setMyPlayerId] = useState<string | null>(null);
  const [players, setPlayers] = useState<PlayerModel[] | null>([]);
  const [units, setUnits] = useState<UnitModel[] | null>(initialContextValue.units);
  const myPlayer = useMemo(() => {
    if (!players || !myPlayerId) return null;
    return players.find((p) => p.getId() === myPlayerId) || null;
  }, [players, myPlayerId]);
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
    worldJourneyApiService.current?.move(direction);
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

  const placeItem = useCallback(() => {
    worldJourneyApiService.current?.placeItem();
  }, []);

  const removeItem = useCallback(() => {
    worldJourneyApiService.current?.removeItem();
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
          enterWorld,
          move,
          leaveWorld,
          changeHeldItem,
          placeItem,
          removeItem,
          addCameraDistance,
          subtractCameraDistance,
        }),
        [
          connectionStatus,
          myPlayer,
          otherPlayers,
          units,
          cameraDistance,
          enterWorld,
          move,
          changeHeldItem,
          placeItem,
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
