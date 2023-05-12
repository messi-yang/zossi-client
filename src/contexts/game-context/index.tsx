import { createContext, useCallback, useRef, useState, useMemo, MutableRefObject } from 'react';
import { GameConnectionService } from '@/apis/services/game-connection-service';
import { DirectionVo } from '@/models/valueObjects';
import { UnitAgg, PlayerAgg } from '@/models/aggregates';

type GameStatus = 'WAITING' | 'CONNECTING' | 'OPEN' | 'DISCONNECTING' | 'DISCONNECTED';

type ContextValue = {
  gameStatus: GameStatus;
  myPlayer: PlayerAgg | null;
  otherPlayers: PlayerAgg[] | null;
  units: UnitAgg[] | null;
  joinGame: (gameId: string) => void;
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
    joinGame: () => {},
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
  const gameConnectionService: MutableRefObject<GameConnectionService | null> = useRef(null);

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
      if (gameConnectionService.current) return;

      const newGameConnectionService = GameConnectionService.new(gameId, {
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
            gameConnectionService.current = null;
            reset();
          } else {
            setGameStatus('DISCONNECTED');
            gameConnectionService.current = null;
          }
        },
      });
      setGameStatus('CONNECTING');
      gameConnectionService.current = newGameConnectionService;
    },
    [gameConnectionService]
  );

  const move = useCallback((direction: DirectionVo) => {
    gameConnectionService.current?.move(direction);
  }, []);

  const leaveGame = useCallback(() => {
    setGameStatus('DISCONNECTING');
    gameConnectionService.current?.disconnect();
  }, []);

  const changeHeldItem = useCallback((itemId: string) => {
    gameConnectionService.current?.changeHeldItem(itemId);
  }, []);

  const placeItem = useCallback(() => {
    gameConnectionService.current?.placeItem();
  }, []);

  const removeItem = useCallback(() => {
    gameConnectionService.current?.removeItem();
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

export { Provider as GameProvider, Context as GameContext };
