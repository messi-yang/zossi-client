import { createContext, useCallback, useState, useMemo } from 'react';
import GameSocket from '@/apis/GameSocket';
import { DirectionVo, BoundVo } from '@/models/valueObjects';
import { ItemAgg, UnitAgg, PlayerAgg } from '@/models/aggregates';

type GameStatus = 'WAITING' | 'CONNECTING' | 'OPEN' | 'DISCONNECTING' | 'DISCONNECTED';

type ContextValue = {
  gameStatus: GameStatus;
  myPlayer: PlayerAgg | null;
  players: PlayerAgg[] | null;
  bound: BoundVo | null;
  units: UnitAgg[] | null;
  items: ItemAgg[] | null;
  joinGame: (gameId: string) => void;
  move: (direction: DirectionVo) => void;
  placeItem: (itemId: string) => void;
  destroyItem: () => void;
  leaveGame: () => void;
};

function createInitialContextValue(): ContextValue {
  return {
    gameStatus: 'DISCONNECTED',
    myPlayer: null,
    players: null,
    bound: null,
    units: null,
    items: null,
    joinGame: () => {},
    move: () => {},
    placeItem: () => {},
    destroyItem: () => {},
    leaveGame: () => {},
  };
}

const Context = createContext<ContextValue>(createInitialContextValue());

type Props = {
  children: JSX.Element;
};

export function Provider({ children }: Props) {
  const [gameSocket, setGameSocket] = useState<GameSocket | null>(null);
  const [gameStatus, setGameStatus] = useState<GameStatus>('WAITING');

  const initialContextValue = createInitialContextValue();
  const [playerId, setPlayerid] = useState<string | null>(null);
  const [players, setPlayers] = useState<PlayerAgg[] | null>(initialContextValue.players);
  const [items, setItems] = useState<ItemAgg[] | null>(initialContextValue.items);
  const [bound, setBound] = useState<BoundVo | null>(initialContextValue.bound);
  const [units, setUnits] = useState<UnitAgg[] | null>(initialContextValue.units);

  const myPlayer = useMemo(() => {
    if (!players) {
      return null;
    }
    return players.find((player) => player.getId() === playerId) || null;
  }, [playerId, players]);

  const reset = useCallback(() => {
    setPlayerid(null);
    setPlayers(initialContextValue.players);
    setBound(initialContextValue.bound);
    setUnits(initialContextValue.units);
    setItems(initialContextValue.items);
  }, []);

  const joinGame = useCallback(
    (gameId: string) => {
      const hasUncleanedConnection = !!gameSocket;
      if (hasUncleanedConnection) {
        return;
      }

      const newGameSocket = GameSocket.newGameSocket(gameId, {
        onGameJoined: (
          newPlayerId: string,
          newPlayers: PlayerAgg[],
          newBound: BoundVo,
          newUnits: UnitAgg[],
          newItems: ItemAgg[]
        ) => {
          setPlayerid(newPlayerId);
          setPlayers(newPlayers);
          setBound(newBound);
          setUnits(newUnits);
          setItems(newItems);
        },
        onPlayersUpdated: (newPlayers: PlayerAgg[]) => {
          setPlayers(newPlayers);
        },
        onUnitsUpdated: (newBound: BoundVo, newUnits: UnitAgg[]) => {
          setBound(newBound);
          setUnits(newUnits);
        },
        onOpen: () => {
          setGameStatus('OPEN');
        },
        onClose: (disconnectedByClient: boolean) => {
          if (disconnectedByClient) {
            setGameStatus('WAITING');
            setGameSocket(null);
            reset();
          } else {
            setGameStatus('DISCONNECTED');
            setGameSocket(null);
          }
        },
      });
      setGameStatus('CONNECTING');
      setGameSocket(newGameSocket);
    },
    [gameSocket]
  );

  const move = useCallback(
    (direction: DirectionVo) => {
      gameSocket?.move(direction);
    },
    [gameSocket]
  );

  const leaveGame = useCallback(() => {
    setGameStatus('DISCONNECTING');
    gameSocket?.disconnect();
  }, [gameSocket]);

  const placeItem = useCallback(
    (itemId: string) => {
      gameSocket?.placeItem(itemId);
    },
    [gameSocket]
  );

  const destroyItem = useCallback(() => {
    gameSocket?.destroyItem();
  }, [gameSocket]);

  return (
    <Context.Provider
      value={useMemo<ContextValue>(
        () => ({
          gameStatus,
          myPlayer,
          players,
          bound,
          units,
          items,
          joinGame,
          move,
          leaveGame,
          placeItem,
          destroyItem,
        }),
        [gameStatus, myPlayer, players, bound, units, items, joinGame, move, leaveGame, placeItem]
      )}
    >
      {children}
    </Context.Provider>
  );
}

export default Context;
