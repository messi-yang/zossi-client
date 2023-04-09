import { createContext, useCallback, useRef, useState, useMemo, MutableRefObject } from 'react';
import GameSocket from '@/apis/GameSocket';
import { DirectionVo } from '@/models/valueObjects';
import { UnitAgg, PlayerAgg } from '@/models/aggregates';

type GameStatus = 'WAITING' | 'CONNECTING' | 'OPEN' | 'DISCONNECTING' | 'DISCONNECTED';

type ContextValue = {
  gameStatus: GameStatus;
  myPlayer: PlayerAgg | null;
  otherPlayers: PlayerAgg[] | null;
  units: UnitAgg[] | null;
  joinGame: (gameId: string) => boolean;
  move: (direction: DirectionVo) => void;
  changeHeldItem: (itemId: string) => void;
  placeItem: () => void;
  removeItem: () => void;
  leaveGame: () => void;
};

function createInitialContextValue(): ContextValue {
  return {
    gameStatus: 'WAITING',
    myPlayer: null,
    otherPlayers: null,
    units: null,
    joinGame: () => false,
    move: () => {},
    changeHeldItem: () => {},
    placeItem: () => {},
    removeItem: () => {},
    leaveGame: () => {},
  };
}

const Context = createContext<ContextValue>(createInitialContextValue());

type Props = {
  children: JSX.Element;
};

export function Provider({ children }: Props) {
  const gameSocket: MutableRefObject<GameSocket | null> = useRef(null);

  const [gameStatus, setGameStatus] = useState<GameStatus>('WAITING');
  const initialContextValue = createInitialContextValue();
  const [myPlayer, setMyPlayer] = useState<PlayerAgg | null>(null);
  const [otherPlayers, setOtherPlayers] = useState<PlayerAgg[] | null>([]);
  const [units, setUnits] = useState<UnitAgg[] | null>(initialContextValue.units);

  const reset = useCallback(() => {
    setMyPlayer(null);
    setOtherPlayers([]);
    setUnits(initialContextValue.units);
  }, []);

  const joinGame = useCallback(
    (gameId: string) => {
      if (gameSocket.current) {
        return false;
      }

      const newGameSocket = GameSocket.newGameSocket(gameId, {
        onGameJoined: () => {},
        onPlayersUpdated: (newMyPlayer, newOtherPlayers: PlayerAgg[]) => {
          setMyPlayer(newMyPlayer);
          setOtherPlayers(newOtherPlayers);
        },
        onUnitsUpdated: (newUnits: UnitAgg[]) => {
          setUnits(newUnits);
        },
        onOpen: () => {
          setGameStatus('OPEN');
        },
        onClose: (disconnectedByClient: boolean) => {
          if (disconnectedByClient) {
            setGameStatus('WAITING');
            gameSocket.current = null;
            reset();
          } else {
            setGameStatus('DISCONNECTED');
            gameSocket.current = null;
          }
        },
      });
      setGameStatus('CONNECTING');
      gameSocket.current = newGameSocket;
      return true;
    },
    [gameSocket]
  );

  const move = useCallback((direction: DirectionVo) => {
    gameSocket.current?.move(direction);
  }, []);

  const leaveGame = useCallback(() => {
    setGameStatus('DISCONNECTING');
    gameSocket.current?.disconnect();
  }, []);

  const changeHeldItem = useCallback((itemId: string) => {
    gameSocket.current?.changeHeldItem(itemId);
  }, []);

  const placeItem = useCallback(() => {
    gameSocket.current?.placeItem();
  }, []);

  const removeItem = useCallback(() => {
    gameSocket.current?.removeItem();
  }, []);

  return (
    <Context.Provider
      value={useMemo<ContextValue>(
        () => ({
          gameStatus,
          myPlayer,
          otherPlayers,
          units,
          joinGame,
          move,
          leaveGame,
          changeHeldItem,
          placeItem,
          removeItem,
        }),
        [gameStatus, myPlayer, otherPlayers, units, joinGame, move, changeHeldItem, placeItem, leaveGame]
      )}
    >
      {children}
    </Context.Provider>
  );
}

export default Context;
