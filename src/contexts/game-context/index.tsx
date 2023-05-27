import { createContext, useCallback, useRef, useState, useMemo } from 'react';
import { GameApiService } from '@/api-services/game-api-service';
import { UnitModel, PlayerModel, DirectionModel } from '@/models';

type GameStatus = 'WAITING' | 'CONNECTING' | 'OPEN' | 'DISCONNECTING' | 'DISCONNECTED';

type ContextValue = {
  gameStatus: GameStatus;
  myPlayer: PlayerModel | null;
  otherPlayers: PlayerModel[] | null;
  units: UnitModel[] | null;
  joinGame: (gameId: string) => void;
  move: (direction: DirectionModel) => void;
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
  const gameApiService = useRef<GameApiService | null>(null);

  const [gameStatus, setGameStatus] = useState<GameStatus>('WAITING');
  const initialContextValue = createInitialContextValue();
  const [myPlayer, setMyPlayer] = useState<PlayerModel | null>(null);
  const [otherPlayers, setOtherPlayers] = useState<PlayerModel[] | null>([]);
  const [units, setUnits] = useState<UnitModel[] | null>(initialContextValue.units);

  const reset = useCallback(() => {
    setMyPlayer(null);
    setOtherPlayers([]);
    setUnits(initialContextValue.units);
  }, []);

  const joinGame = useCallback((gameId: string) => {
    if (gameApiService.current) {
      return;
    }

    const newGameApiService = GameApiService.new(gameId, {
      onGameJoined: () => {},
      onPlayersUpdated: (newMyPlayer, newOtherPlayers: PlayerModel[]) => {
        setMyPlayer(newMyPlayer);
        setOtherPlayers(newOtherPlayers);
      },
      onUnitsUpdated: (newUnits: UnitModel[]) => {
        setUnits(newUnits);
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

  const leaveGame = useCallback(() => {
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
