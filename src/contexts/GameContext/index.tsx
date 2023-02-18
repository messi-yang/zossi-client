import { createContext, useCallback, useState, useMemo } from 'react';
import GameSocket from '@/apis/GameSocket';
import { LocationVo, DirectionVo, BoundVo } from '@/models/valueObjects';
import { ItemAgg, UnitAgg } from '@/models/aggregates';
import { PlayerEntity } from '@/models/entities';

type GameStatus = 'WAITING' | 'CONNECTING' | 'OPEN' | 'DISCONNECTING' | 'DISCONNECTED';

type ContextValue = {
  gameStatus: GameStatus;
  myPlayer: PlayerEntity | null;
  players: PlayerEntity[] | null;
  bound: BoundVo | null;
  units: UnitAgg[] | null;
  items: ItemAgg[] | null;
  joinGame: () => void;
  move: (direction: DirectionVo) => void;
  placeItem: (location: LocationVo, itemId: number) => void;
  destroyItem: (location: LocationVo) => void;
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
  const [players, setPlayers] = useState<PlayerEntity[] | null>(initialContextValue.players);
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

  const joinGame = useCallback(() => {
    const hasUncleanedConnection = !!gameSocket;
    if (hasUncleanedConnection) {
      return;
    }

    const newGameSocket = GameSocket.newGameSocket({
      onGameJoined: (
        newPlayerId: string,
        newPlayers: PlayerEntity[],
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
      onPlayersUpdated: (newPlayers: PlayerEntity[]) => {
        setPlayers(newPlayers);
      },
      onViewUpdated: (newBound: BoundVo, newUnits: UnitAgg[]) => {
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
  }, [gameSocket]);

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
    (location: LocationVo, itemId: number) => {
      gameSocket?.placeItem(location, itemId);
    },
    [gameSocket]
  );

  const destroyItem = useCallback(
    (location: LocationVo) => {
      gameSocket?.destroyItem(location);
    },
    [gameSocket]
  );

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
