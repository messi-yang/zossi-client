import { createContext, useCallback, useState, useMemo } from 'react';
import GameSocket from '@/apis/GameSocket';
import { LocationVo, SizeVo, ViewVo, DirectionVo } from '@/models/valueObjects';
import { ItemAgg } from '@/models/aggregates';
import { PlayerEntity } from '@/models/entities';

type GameStatus = 'WAITING' | 'CONNECTING' | 'OPEN' | 'DISCONNECTING' | 'DISCONNECTED';

type ContextValue = {
  gameStatus: GameStatus;
  mapSize: SizeVo | null;
  myPlayer: PlayerEntity | null;
  players: PlayerEntity[] | null;
  view: ViewVo | null;
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
    mapSize: null,
    myPlayer: null,
    players: null,
    view: null,
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
  const [mapSize, setMapSize] = useState<SizeVo | null>(initialContextValue.mapSize);
  const [playerId, setPlayerid] = useState<string | null>(null);
  const [players, setPlayers] = useState<PlayerEntity[] | null>(initialContextValue.players);
  const [items, setItems] = useState<ItemAgg[] | null>(initialContextValue.items);
  const [view, setView] = useState<ViewVo | null>(initialContextValue.view);

  const myPlayer = useMemo(() => {
    if (!players) {
      return null;
    }
    return players.find((player) => player.getId() === playerId) || null;
  }, [playerId, players]);

  const reset = useCallback(() => {
    setMapSize(initialContextValue.mapSize);
    setItems(initialContextValue.items);
  }, []);

  const joinGame = useCallback(() => {
    const hasUncleanedConnection = !!gameSocket;
    if (hasUncleanedConnection) {
      return;
    }

    const newGameSocket = GameSocket.newGameSocket({
      onGameJoined: (newPlayerId: string, newPlayers: PlayerEntity[], newMapSize: SizeVo, newView: ViewVo) => {
        setPlayerid(newPlayerId);
        setPlayers(newPlayers);
        setMapSize(newMapSize);
        setView(newView);
      },
      onPlayersUpdated: (newPlayers: PlayerEntity[]) => {
        setPlayers(newPlayers);
      },
      onViewUpdated: (newView: ViewVo) => {
        setView(newView);
      },
      onItemsUpdated: (newItems: ItemAgg[]) => {
        setItems(newItems);
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
          mapSize,
          myPlayer,
          players,
          view,
          items,
          joinGame,
          move,
          leaveGame,
          placeItem,
          destroyItem,
        }),
        [gameStatus, mapSize, myPlayer, players, view, items, joinGame, move, leaveGame, placeItem]
      )}
    >
      {children}
    </Context.Provider>
  );
}

export default Context;
