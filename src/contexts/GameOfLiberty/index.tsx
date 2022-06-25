import {
  createContext,
  useCallback,
  useState,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import cloneDeep from 'lodash/cloneDeep';
import type { Status, MapSize, Coordinate, Area, Units } from './types';
import { EventType } from './eventTypes';
import type { Event } from './eventTypes';
import type { WatchAreaAction, ReviveUnitsAction } from './actionTypes';

type GameOfLibertyContextValue = {
  status: Status;
  mapSize: MapSize;
  area: Area;
  units: Units;
  joinGame: () => void;
  reviveUnits: (coordinates: Coordinate[]) => void;
  watchArea: (area: Area) => void;
  leaveGame: () => void;
};

function createInitialGameOfLibertyContextValue(): GameOfLibertyContextValue {
  return {
    status: 'OFFLINE',
    mapSize: {
      width: 0,
      height: 0,
    },
    area: {
      from: { x: 0, y: 0 },
      to: { x: 0, y: 0 },
    },
    units: [],
    joinGame: () => {},
    reviveUnits: () => {},
    watchArea: () => {},
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
  const socketRef = useRef<WebSocket | null>(null);
  const [mapSize, setMapSize] = useState<MapSize>(
    initialGameOfLibertyContextValue.mapSize
  );
  const [area, setArea] = useState<Area>(initialGameOfLibertyContextValue.area);
  const [units, setUnits] = useState<Units>(
    initialGameOfLibertyContextValue.units
  );
  const [status, setStatus] = useState<Status>(
    initialGameOfLibertyContextValue.status
  );

  const reviveUnits = useCallback(
    (coordinates: Coordinate[]) => {
      if (!socketRef.current) {
        return;
      }
      if (status !== 'ONLINE') {
        return;
      }

      const action: ReviveUnitsAction = {
        type: 'REVIVE_UNITS',
        payload: {
          coordinates,
        },
      };
      socketRef.current.send(JSON.stringify(action));
    },
    [socketRef.current, status]
  );

  const watchArea = useCallback(
    (targetArea: Area) => {
      if (!socketRef.current) {
        return;
      }
      if (status !== 'ONLINE') {
        return;
      }

      const action: WatchAreaAction = {
        type: 'WATCH_AREA',
        payload: {
          area: targetArea,
        },
      };
      socketRef.current.send(JSON.stringify(action));
    },
    [socketRef.current, status]
  );

  const leaveGame = useCallback(() => {
    if (!socketRef.current) {
      return;
    }

    setStatus('OFFLINE');
    socketRef.current.close();
  }, [socketRef.current]);

  const joinGame = useCallback(() => {
    const newSocket = new WebSocket('ws://localhost:8080/ws/game/');
    socketRef.current = newSocket;

    newSocket.onopen = () => {
      setStatus('ONLINE');
    };

    newSocket.onclose = () => {
      setStatus('OFFLINE');
    };
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.onmessage = (evt: any) => {
        const event: Event = JSON.parse(evt.data);
        if (event.type === EventType.UnitsUpdated) {
          const newUnits = cloneDeep(units);
          console.log(event);
          event.payload.coordinates.forEach((coord, idx) => {
            newUnits[coord.x][coord.y] = event.payload.units[idx];
          });

          setUnits(newUnits);
        } else if (event.type === EventType.AreaUpdated) {
          setArea(event.payload.area);
          setUnits(event.payload.units);
        } else if (event.type === EventType.InformationUpdated) {
          setMapSize(event.payload.mapSize);
        }
      };
    }
  }, [socketRef.current, units]);

  const gameOfLibertyContextValue = useMemo<GameOfLibertyContextValue>(
    () => ({
      status,
      mapSize,
      area,
      units,
      joinGame,
      reviveUnits,
      watchArea,
      leaveGame,
    }),
    [status, units, joinGame, watchArea, leaveGame]
  );

  return (
    <GameOfLibertyContext.Provider value={gameOfLibertyContextValue}>
      {children}
    </GameOfLibertyContext.Provider>
  );
}

export default GameOfLibertyContext;
export type { Area, Units };
