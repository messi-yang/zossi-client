import { createContext, useCallback, useState, useMemo } from 'react';
import { GameConnectionService } from '@/apis/services/game-connection-service';
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
  const [gameConnectionService, setGameConnectionService] = useState<GameConnectionService | null>(null);

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

  const joinGame = useCallback(
    (gameId: string) => {
      if (gameConnectionService) {
        return;
      }

      const newGameConnectionService = GameConnectionService.new(gameId, {
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
          setGameConnectionService(null);
          reset();
        },
      });
      setGameStatus('CONNECTING');
      setGameConnectionService(newGameConnectionService);
    },
    [gameConnectionService]
  );

  const move = useCallback(
    (direction: DirectionModel) => {
      gameConnectionService?.move(direction);
    },
    [gameConnectionService]
  );

  const leaveGame = useCallback(() => {
    if (!gameConnectionService) {
      return;
    }
    setGameStatus('DISCONNECTING');
    gameConnectionService.disconnect();
  }, [gameConnectionService]);

  const changeHeldItem = useCallback(
    (itemId: string) => {
      gameConnectionService?.changeHeldItem(itemId);
    },
    [gameConnectionService]
  );

  const placeItem = useCallback(() => {
    gameConnectionService?.placeItem();
  }, [gameConnectionService]);

  const removeItem = useCallback(() => {
    gameConnectionService?.removeItem();
  }, [gameConnectionService]);

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
