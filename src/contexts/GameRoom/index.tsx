import { createContext, useCallback, useState, useMemo, useRef, useEffect } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import type { AreaDTO, MapSizeDTO } from '@/dto';
import type { UnitVO, CoordinateVO } from '@/valueObjects';
import { ungzipBlob } from '@/utils/compression';
import { EventTypeEnum } from './eventTypes';
import type { Event, AreaUpdatedEventPayload } from './eventTypes';
import { ActionTypeEnum } from './actionTypes';
import type { WatchAreaAction, ReviveUnitsAction } from './actionTypes';

type Status = 'OFFLINE' | 'ONLINE';

function convertAreaUpdatedEventPayloadToUnitEntities({ area, units }: AreaUpdatedEventPayload): UnitVO[][] {
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
  mapSize: MapSizeDTO | null;
  displayedArea: AreaDTO | null;
  targetArea: AreaDTO | null;
  units: UnitVO[][];
  relativeCoordinates: CoordinateVO[] | null;
  joinGame: () => void;
  updateRelativeCoordinates: (coordinates: CoordinateVO[] | null) => void;
  reviveUnits: (coordinates: CoordinateVO[]) => void;
  watchArea: (area: AreaDTO) => void;
  leaveGame: () => void;
};

function createInitialGameRoomContextValue(): GameRoomContextValue {
  return {
    status: 'OFFLINE',
    mapSize: null,
    displayedArea: null,
    targetArea: null,
    units: [],
    relativeCoordinates: [
      { x: -1, y: 0 },
      { x: 0, y: -1 },
      { x: 0, y: 1 },
      { x: 1, y: 0 },
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
  const [mapSize, setMapSize] = useState<MapSizeDTO | null>(initialGameRoomContextValue.mapSize);
  const [displayedArea, setDisplayedArea] = useState<AreaDTO | null>(initialGameRoomContextValue.displayedArea);
  const [targetArea, setTargetArea] = useState<AreaDTO | null>(initialGameRoomContextValue.targetArea);
  const [units, setUnits] = useState<UnitVO[][]>(initialGameRoomContextValue.units);
  const [relativeCoordinates, setRelativeCoordinates] = useState<CoordinateVO[] | null>(
    initialGameRoomContextValue.relativeCoordinates
  );
  const [status, setStatus] = useState<Status>(initialGameRoomContextValue.status);

  const updateRelativeCoordinates = useCallback(
    (coordinates: CoordinateVO[] | null) => {
      setRelativeCoordinates(coordinates);
    },
    [socketRef.current, status]
  );

  const reviveUnits = useCallback(
    (coordinates: CoordinateVO[]) => {
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

  const sendWatchAreaAction = useCallback(
    (newArea: AreaDTO) => {
      if (!socketRef.current) {
        return;
      }
      if (status !== 'ONLINE') {
        return;
      }

      const action: WatchAreaAction = {
        type: ActionTypeEnum.WatchArea,
        payload: {
          area: newArea,
        },
      };
      socketRef.current.send(JSON.stringify(action));
    },
    [socketRef.current, status]
  );
  const sendWatchAreaActionDebouncer = useCallback(debounce(sendWatchAreaAction, 20), [sendWatchAreaAction]);
  const watchArea = useCallback(
    (newArea: AreaDTO) => {
      setTargetArea(newArea);
      sendWatchAreaActionDebouncer(newArea);
    },
    [sendWatchAreaActionDebouncer]
  );

  const leaveGame = useCallback(() => {
    if (!socketRef.current) {
      return;
    }

    setStatus('OFFLINE');
    socketRef.current.close();
  }, [socketRef.current]);

  const joinGame = useCallback(() => {
    if (status === 'ONLINE') {
      return;
    }

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
      socketRef.current.onmessage = async (evt: any) => {
        const decompressedBlob = await ungzipBlob(evt.data as Blob);
        const eventJsonString = await decompressedBlob.text();

        const event: Event = JSON.parse(eventJsonString);
        if (event.type === EventTypeEnum.CoordinatesUpdated) {
          if (!displayedArea) {
            return;
          }
          const newUnits = cloneDeep(units);
          event.payload.coordinates.forEach((coord, idx) => {
            const colIdx = coord.x - displayedArea.from.x;
            const rowIdx = coord.y - displayedArea.from.y;
            newUnits[colIdx][rowIdx] = {
              ...newUnits[colIdx][rowIdx],
              ...event.payload.units[idx],
            };
          });

          setUnits(newUnits);
        } else if (event.type === EventTypeEnum.AreaUpdated) {
          if (!isEqual(displayedArea, event.payload.area)) {
            setDisplayedArea(event.payload.area);
          }
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
      displayedArea,
      targetArea,
      units,
      relativeCoordinates,
      joinGame,
      updateRelativeCoordinates,
      reviveUnits,
      watchArea,
      leaveGame,
    }),
    [
      status,
      mapSize,
      displayedArea,
      targetArea,
      units,
      relativeCoordinates,
      joinGame,
      updateRelativeCoordinates,
      reviveUnits,
      watchArea,
      leaveGame,
    ]
  );

  return <GameRoomContext.Provider value={gameRoomContextValue}>{children}</GameRoomContext.Provider>;
}

export default GameRoomContext;
