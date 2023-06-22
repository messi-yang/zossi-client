import { createContext, useCallback, useRef, useState, useMemo } from 'react';
import { GameApiService } from '@/api-services/game-api-service';
import { UnitModel, PlayerModel, DirectionModel, PositionModel } from '@/models';

type GameStatus = 'WAITING' | 'CONNECTING' | 'OPEN' | 'DISCONNECTING' | 'DISCONNECTED';

type ContextValue = {
  gameStatus: GameStatus;
  myPlayer: PlayerModel | null;
  otherPlayers: PlayerModel[] | null;
  units: UnitModel[] | null;
  enterWorld: (gameId: string) => void;
  move: (direction: DirectionModel) => void;
  changeHeldItem: (itemId: string) => void;
  placeItem: () => void;
  removeItem: () => void;
  leaveWorld: () => void;
};

function createInitialContextValue(): ContextValue {
  return {
    gameStatus: 'WAITING',
    myPlayer: null,
    otherPlayers: null,
    units: null,
    enterWorld: () => {},
    move: () => {},
    changeHeldItem: () => {},
    placeItem: () => {},
    removeItem: () => {},
    leaveWorld: () => {},
  };
}

const Context = createContext<ContextValue>(createInitialContextValue());

type Props = {
  children: JSX.Element;
};

export function Provider({ children }: Props) {
  const gameApiService = useRef<GameApiService | null>(null);

  const [gameStatus, setGameStatus] = useState<GameStatus>('WAITING');
  const initialContextValue = createInitialContextValue();
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

  const enterWorld = useCallback((gameId: string) => {
    if (gameApiService.current) {
      return;
    }

    const newGameApiService = GameApiService.new(gameId, {
      onGameJoined: () => {},
      onWorldEntered: (_units, _myPlayerId, _players) => {
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
        setGameStatus('OPEN');
      },
      onClose: () => {
        setGameStatus('DISCONNECTED');
        gameApiService.current = null;
        reset();
      },
    });
    setGameStatus('CONNECTING');
    gameApiService.current = newGameApiService;
  }, []);

  const move = useCallback((direction: DirectionModel) => {
    gameApiService.current?.move(direction);
  }, []);

  const leaveWorld = useCallback(() => {
    if (!gameApiService.current) {
      return;
    }
    setGameStatus('DISCONNECTING');
    gameApiService.current.disconnect();
  }, []);

  const changeHeldItem = useCallback((itemId: string) => {
    gameApiService.current?.changeHeldItem(itemId);
  }, []);

  const placeItem = useCallback(() => {
    gameApiService.current?.placeItem();
  }, []);

  const removeItem = useCallback(() => {
    gameApiService.current?.removeItem();
  }, []);

  return (
    <Context.Provider
      value={useMemo<ContextValue>(
        () => ({
          gameStatus,
          myPlayer,
          otherPlayers,
          units,
          enterWorld,
          move,
          leaveWorld,
          changeHeldItem,
          placeItem,
          removeItem,
        }),
        [gameStatus, myPlayer, otherPlayers, units, enterWorld, move, changeHeldItem, placeItem, leaveWorld]
      )}
    >
      {children}
    </Context.Provider>
  );
}

export { Provider as GameProvider, Context as GameContext };
