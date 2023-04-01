import { createContext, useCallback, useState, useMemo } from 'react';
import GameSocket from '@/apis/GameSocket';
import { DirectionVo, BoundVo } from '@/models/valueObjects';
import { UnitAgg, PlayerAgg } from '@/models/aggregates';

type GameStatus = 'WAITING' | 'CONNECTING' | 'OPEN' | 'DISCONNECTING' | 'DISCONNECTED';

type ContextValue = {
  gameStatus: GameStatus;
  myPlayer: PlayerAgg | null;
  otherPlayers: PlayerAgg[] | null;
  visionBound: BoundVo | null;
  units: UnitAgg[] | null;
  joinGame: (gameId: string) => void;
  move: (direction: DirectionVo) => void;
  placeItem: () => void;
  destroyItem: () => void;
  leaveGame: () => void;
};

function createInitialContextValue(): ContextValue {
  return {
    gameStatus: 'WAITING',
    myPlayer: null,
    otherPlayers: null,
    visionBound: null,
    units: null,
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
  const [myPlayer, setMyPlayer] = useState<PlayerAgg | null>(null);
  const [otherPlayers, setOtherPlayers] = useState<PlayerAgg[] | null>([]);
  const [visionBound, setVisionBound] = useState<BoundVo | null>(initialContextValue.visionBound);
  const [units, setUnits] = useState<UnitAgg[] | null>(initialContextValue.units);

  const reset = useCallback(() => {
    setMyPlayer(null);
    setOtherPlayers([]);
    setVisionBound(initialContextValue.visionBound);
    setUnits(initialContextValue.units);
  }, []);

  const joinGame = useCallback(
    (gameId: string) => {
      const hasUncleanedConnection = !!gameSocket;
      if (hasUncleanedConnection) {
        return;
      }

      const newGameSocket = GameSocket.newGameSocket(gameId, {
        onGameJoined: () => {},
        onPlayersUpdated: (newMyPlayer, newOtherPlayers: PlayerAgg[]) => {
          setMyPlayer(newMyPlayer);
          setOtherPlayers(newOtherPlayers);
        },
        onUnitsUpdated: (newVisionBound: BoundVo, newUnits: UnitAgg[]) => {
          setVisionBound(newVisionBound);
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

  const placeItem = useCallback(() => {
    gameSocket?.placeItem();
  }, [gameSocket]);

  const destroyItem = useCallback(() => {
    gameSocket?.destroyItem();
  }, [gameSocket]);

  return (
    <Context.Provider
      value={useMemo<ContextValue>(
        () => ({
          gameStatus,
          myPlayer,
          otherPlayers,
          visionBound,
          units,
          joinGame,
          move,
          leaveGame,
          placeItem,
          destroyItem,
        }),
        [gameStatus, myPlayer, otherPlayers, visionBound, units, joinGame, move, leaveGame, placeItem]
      )}
    >
      {children}
    </Context.Provider>
  );
}

export default Context;
