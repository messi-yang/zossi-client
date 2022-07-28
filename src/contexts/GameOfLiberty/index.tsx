import {
  createContext,
  useCallback,
  useState,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import cloneDeep from 'lodash/cloneDeep';
import type { AreaDTO, CoordinateDTO, MapSizeDTO, UnitDTO } from '@/dto';
import { EventTypeEnum } from './eventTypes';
import type { Event } from './eventTypes';
import { ActionTypeEnum } from './actionTypes';
import type { WatchAreaAction, ReviveUnitsAction } from './actionTypes';

type Status = 'OFFLINE' | 'ONLINE';

type GameOfLibertyContextValue = {
  status: Status;
  mapSize: MapSizeDTO;
  area: AreaDTO;
  units: UnitDTO[][];
  relativeCoordinates: CoordinateDTO[];
  joinGame: () => void;
  updateRelativeCoordinates: (coordinates: CoordinateDTO[]) => void;
  reviveUnits: (coordinates: CoordinateDTO[]) => void;
  watchArea: (area: AreaDTO) => void;
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
    relativeCoordinates: [
      { x: -1, y: -1 },
      { x: 0, y: -1 },
      { x: 1, y: -1 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
      { x: -1, y: 1 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ],
    joinGame: () => {},
    updateRelativeCoordinates: () => {},
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
  const [mapSize, setMapSize] = useState<MapSizeDTO>(
    initialGameOfLibertyContextValue.mapSize
  );
  const [area, setArea] = useState<AreaDTO>(
    initialGameOfLibertyContextValue.area
  );
  const [units, setUnits] = useState<UnitDTO[][]>(
    initialGameOfLibertyContextValue.units
  );
  const [relativeCoordinates, setRelativeCoordinates] = useState<
    CoordinateDTO[]
  >(initialGameOfLibertyContextValue.relativeCoordinates);
  const [status, setStatus] = useState<Status>(
    initialGameOfLibertyContextValue.status
  );

  const updateRelativeCoordinates = useCallback(
    (coordinates: CoordinateDTO[]) => {
      setRelativeCoordinates(coordinates);
    },
    [socketRef.current, status]
  );

  const reviveUnits = useCallback(
    (coordinates: CoordinateDTO[]) => {
      if (!socketRef.current) {
        return;
      }
      if (status !== 'ONLINE') {
        return;
      }

      const action: ReviveUnitsAction = {
        type: ActionTypeEnum.ReviveUnits,
        payload: {
          coordinates,
        },
      };
      socketRef.current.send(JSON.stringify(action));
    },
    [socketRef.current, status]
  );

  const watchArea = useCallback(
    (targetArea: AreaDTO) => {
      if (!socketRef.current) {
        return;
      }
      if (status !== 'ONLINE') {
        return;
      }

      const action: WatchAreaAction = {
        type: ActionTypeEnum.WatchArea,
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
        if (event.type === EventTypeEnum.CoordinatesUpdated) {
          const newUnits = cloneDeep(units);
          event.payload.coordinates.forEach((coord, idx) => {
            newUnits[coord.x][coord.y] = event.payload.units[idx];
          });

          setUnits(newUnits);
        } else if (event.type === EventTypeEnum.AreaUpdated) {
          setArea(event.payload.area);
          setUnits(event.payload.units);
        } else if (event.type === EventTypeEnum.InformationUpdated) {
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
      relativeCoordinates,
      joinGame,
      updateRelativeCoordinates,
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
