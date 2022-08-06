import { createContext, useCallback, useState, useMemo, useRef, useEffect } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import type { AreaDTO, MapSizeDTO } from '@/dto';
import type { UnitEntity, CoordinateEntity } from '@/entities';
import { EventTypeEnum } from './eventTypes';
import type { Event, AreaUpdatedEventPayload } from './eventTypes';
import { ActionTypeEnum } from './actionTypes';
import type { WatchAreaAction, ReviveUnitsAction } from './actionTypes';

type Status = 'OFFLINE' | 'ONLINE';

function convertAreaUpdatedEventPayloadToUnitEntities({ area, units }: AreaUpdatedEventPayload): UnitEntity[][] {
  const { from } = area;
  return units.map((rowUnits, x) =>
    rowUnits.map((unit, y) => ({
      key: `${x},${y}`,
      coordinate: { x: from.x + x, y: from.y + y },
      alive: unit.alive,
      age: unit.age,
    }))
  );
}

type GameRoomContextValue = {
  status: Status;
  mapSize: MapSizeDTO;
  area: AreaDTO;
  units: UnitEntity[][];
  relativeCoordinates: CoordinateEntity[];
  joinGame: () => void;
  updateRelativeCoordinates: (coordinates: CoordinateEntity[]) => void;
  reviveUnits: (coordinates: CoordinateEntity[]) => void;
  watchArea: (area: AreaDTO) => void;
  leaveGame: () => void;
};

function createInitialGameRoomContextValue(): GameRoomContextValue {
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

const GameRoomContext = createContext<GameRoomContextValue>(createInitialGameRoomContextValue());

type Props = {
  children: JSX.Element;
};

export function Provider({ children }: Props) {
  const initialGameRoomContextValue = createInitialGameRoomContextValue();
  const socketRef = useRef<WebSocket | null>(null);
  const [mapSize, setMapSize] = useState<MapSizeDTO>(initialGameRoomContextValue.mapSize);
  const [area, setArea] = useState<AreaDTO>(initialGameRoomContextValue.area);
  const [units, setUnits] = useState<UnitEntity[][]>(initialGameRoomContextValue.units);
  const [relativeCoordinates, setRelativeCoordinates] = useState<CoordinateEntity[]>(
    initialGameRoomContextValue.relativeCoordinates
  );
  const [status, setStatus] = useState<Status>(initialGameRoomContextValue.status);

  const updateRelativeCoordinates = useCallback(
    (coordinates: CoordinateEntity[]) => {
      setRelativeCoordinates(coordinates);
    },
    [socketRef.current, status]
  );

  const reviveUnits = useCallback(
    (coordinates: CoordinateEntity[]) => {
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
  const watchAreaDebouncer = useCallback(debounce(watchArea, 200), [watchArea]);

  const leaveGame = useCallback(() => {
    if (!socketRef.current) {
      return;
    }

    setStatus('OFFLINE');
    socketRef.current.close();
  }, [socketRef.current]);

  const joinGame = useCallback(() => {
    const schema = process.env.NODE_ENV === 'production' ? 'wss' : 'ws';
    const newSocket = new WebSocket(`${schema}://${process.env.API_DOMAIN}/ws/game/`);
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
            newUnits[coord.x][coord.y] = {
              ...newUnits[coord.x][coord.y],
              ...event.payload.units[idx],
            };
          });

          setUnits(newUnits);
        } else if (event.type === EventTypeEnum.AreaUpdated) {
          setArea(event.payload.area);
          setUnits(convertAreaUpdatedEventPayloadToUnitEntities(event.payload));
        } else if (event.type === EventTypeEnum.InformationUpdated) {
          setMapSize(event.payload.mapSize);
        }
      };
    }
  }, [socketRef.current, units]);

  const gameRoomContextValue = useMemo<GameRoomContextValue>(
    () => ({
      status,
      mapSize,
      area,
      units,
      relativeCoordinates,
      joinGame,
      updateRelativeCoordinates,
      reviveUnits,
      watchArea: watchAreaDebouncer,
      leaveGame,
    }),
    [status, units, joinGame, watchArea, leaveGame]
  );

  return <GameRoomContext.Provider value={gameRoomContextValue}>{children}</GameRoomContext.Provider>;
}

export default GameRoomContext;
