import { createContext, useCallback, useState, useMemo } from 'react';
import type { Status, Area, Units } from './types';
import { EventType } from './eventTypes';
import type { Event } from './eventTypes';
import type { WatchUnitsAction } from './actionTypes';

type GameOfLibertyContextValue = {
  status: Status;
  area: Area;
  units: Units;
  joinGame: () => void;
  watchUnits: (area: Area) => void;
  leaveGame: () => void;
};

function createInitialGameOfLibertyContextValue(): GameOfLibertyContextValue {
  return {
    status: 'OFFLINE',
    area: {
      from: { x: 0, y: 0 },
      to: { x: 0, y: 0 },
    },
    units: [],
    joinGame: () => {},
    watchUnits: () => {},
    leaveGame: () => {},
  };
}

const GameOfLibertyContext = createContext<GameOfLibertyContextValue>(
  createInitialGameOfLibertyContextValue()
);

type Props = {
  children: JSX.Element;
};

export function Provider({ children }: Props) {
  const initialGameOfLibertyContextValue =
    createInitialGameOfLibertyContextValue();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [area, setArea] = useState<Area>(initialGameOfLibertyContextValue.area);
  const [units, setUnits] = useState<Units>(
    initialGameOfLibertyContextValue.units
  );
  const [status, setStatus] = useState<Status>(
    initialGameOfLibertyContextValue.status
  );

  const joinGame = useCallback(() => {
    const newSocket = new WebSocket('ws://localhost:8080/ws/game/');
    setSocket(newSocket);

    newSocket.onopen = () => {
      setStatus('ONLINE');
    };

    newSocket.onmessage = (evt: any) => {
      const event: Event = JSON.parse(evt.data);
      if (event.type === EventType.UnitsUpdated) {
        setArea(event.payload.area);
        setUnits(event.payload.units);
      }
    };

    newSocket.onclose = () => {
      setStatus('OFFLINE');
    };
  }, []);

  const watchUnits = useCallback(
    async (targetArea: Area) => {
      if (!socket) {
        return;
      }

      const action: WatchUnitsAction = {
        type: 'WATCH_UNITS',
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

    setStatus('OFFLINE');
    socket.close();
  }, [socket]);

  const gameOfLibertyContextValue = useMemo<GameOfLibertyContextValue>(
    () => ({
      status,
      area,
      units,
      joinGame,
      watchUnits,
      leaveGame,
    }),
    [status, units, joinGame, watchUnits, leaveGame]
  );

  return (
    <GameOfLibertyContext.Provider value={gameOfLibertyContextValue}>
      {children}
    </GameOfLibertyContext.Provider>
  );
}

export default GameOfLibertyContext;
export type { Area, Units };
