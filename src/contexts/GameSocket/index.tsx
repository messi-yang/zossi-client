import { createContext, useCallback, useState, useMemo } from 'react';
import type { Status, Area, Units } from './types';
import type { GameBlockUpdatedEvent } from './eventTypes';
import type { WatchGameBlockAction } from './actionTypes';

type GameSocketContextValue = {
  status: Status;
  area: Area;
  units: Units;
  joinGame: () => void;
  watchGameBlock: (area: Area) => void;
  leaveGame: () => void;
};

function createInitialGameSocketContextValue(): GameSocketContextValue {
  return {
    status: 'NOT_ESTABLISHED',
    area: {
      from: { x: 0, y: 0 },
      to: { x: 0, y: 0 },
    },
    units: [],
    joinGame: () => {},
    watchGameBlock: () => {},
    leaveGame: () => {},
  };
}

const GameSocketContext = createContext<GameSocketContextValue>(
  createInitialGameSocketContextValue()
);

type Props = {
  children: JSX.Element;
};

export function Provider({ children }: Props) {
  const initialGameSocketContextValue = createInitialGameSocketContextValue();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [area, setArea] = useState<Area>(initialGameSocketContextValue.area);
  const [units, setUnits] = useState<Units>(
    initialGameSocketContextValue.units
  );
  const [status, setStatus] = useState<Status>(
    initialGameSocketContextValue.status
  );

  const joinGame = useCallback(() => {
    const newSocket = new WebSocket('ws://localhost:8080/ws/game/');
    setSocket(newSocket);

    newSocket.onopen = () => {
      setStatus('ESTABLISHED');
    };

    newSocket.onmessage = (evt: any) => {
      const event: GameBlockUpdatedEvent = JSON.parse(evt.data);
      if (event.type === 'GAME_BLOCK_UPDATED') {
        setArea(event.payload.area);
        setUnits(event.payload.units);
      }
    };

    newSocket.onclose = () => {
      setStatus('NOT_ESTABLISHED');
    };
  }, []);

  const watchGameBlock = useCallback(
    async (targetArea: Area) => {
      if (!socket) {
        return;
      }

      const action: WatchGameBlockAction = {
        type: 'WATCH_GAME_BLOCK',
        payload: {
          area: targetArea,
        },
      };
      socket.send(JSON.stringify(action));
    },
    [socket]
  );

  const leaveGame = useCallback(() => {
    if (!socket) {
      return;
    }

    setStatus('NOT_ESTABLISHED');
    socket.close();
  }, [socket]);

  const gameSocketContextValue = useMemo<GameSocketContextValue>(
    () => ({
      status,
      area,
      units,
      joinGame,
      watchGameBlock,
      leaveGame,
    }),
    [status, units, joinGame, watchGameBlock, leaveGame]
  );

  return (
    <GameSocketContext.Provider value={gameSocketContextValue}>
      {children}
    </GameSocketContext.Provider>
  );
}

export default GameSocketContext;
export type { Area, Units };
