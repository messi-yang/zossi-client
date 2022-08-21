import { createContext, useCallback, useState, useMemo, useEffect } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import type { AreaDTO, MapSizeDTO } from '@/dto';
import type { UnitVO, CoordinateVO, OffsetVO, UnitPatternVO } from '@/valueObjects';
import { ungzipBlob, gzipBlob } from '@/utils/compression';
import { EventTypeEnum } from './eventTypes';
import type { Event, AreaUpdatedEventPayload } from './eventTypes';
import { ActionTypeEnum } from './actionTypes';
import type { WatchAreaAction, ReviveUnitsAction } from './actionTypes';

type Status = 'OFFLINE' | 'ONLINE';

function convertAreaUpdatedEventPayloadToUnitEntities({ area, unitMap }: AreaUpdatedEventPayload): UnitVO[][] {
  const { from } = area;
  return unitMap.map((unitCol, x) =>
    unitCol.map((unit, y) => ({
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
  unitMap: UnitVO[][] | null;
  unitPattern: UnitPatternVO;
  joinGame: () => void;
  updateUnitPattern: (pattern: UnitPatternVO) => void;
  reviveUnitsWithPattern: (coordinate: CoordinateVO, unitPatternOffset: OffsetVO, unitPattern: UnitPatternVO) => void;
  watchArea: (area: AreaDTO) => void;
  leaveGame: () => void;
};

function createInitialGameRoomContextValue(): GameRoomContextValue {
  return {
    status: 'OFFLINE',
    mapSize: null,
    displayedArea: null,
    targetArea: null,
    unitMap: null,
    unitPattern: [
      [null, null, null, null, null],
      [null, null, true, null, null],
      [null, true, null, true, null],
      [null, null, true, null, null],
      [null, null, null, null, null],
    ],
    joinGame: () => {},
    updateUnitPattern: () => {},
    reviveUnitsWithPattern: () => {},
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
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [mapSize, setMapSize] = useState<MapSizeDTO | null>(initialGameRoomContextValue.mapSize);
  const [displayedArea, setDisplayedArea] = useState<AreaDTO | null>(initialGameRoomContextValue.displayedArea);
  const [targetArea, setTargetArea] = useState<AreaDTO | null>(initialGameRoomContextValue.targetArea);
  const [unitMap, setUnitMap] = useState<UnitVO[][] | null>(initialGameRoomContextValue.unitMap);
  const [unitPattern, setUnitPattern] = useState<UnitPatternVO>(initialGameRoomContextValue.unitPattern);
  const [status, setStatus] = useState<Status>(initialGameRoomContextValue.status);

  const resetContext = useCallback(() => {
    setMapSize(initialGameRoomContextValue.mapSize);
    setDisplayedArea(initialGameRoomContextValue.displayedArea);
    setTargetArea(initialGameRoomContextValue.targetArea);
    setUnitMap(initialGameRoomContextValue.unitMap);
    setUnitPattern(initialGameRoomContextValue.unitPattern);
    setStatus(initialGameRoomContextValue.status);
  }, []);

  const updateUnitPattern = useCallback(
    (newUnitPattern: UnitPatternVO) => {
      setUnitPattern(newUnitPattern);
    },
    [status]
  );

  const sendMessage = useCallback(
    async (jsonData: Object) => {
      if (!socket || socket.readyState !== socket.OPEN) {
        return;
      }

      const jsonString = JSON.stringify(jsonData);
      const jsonBlob = new Blob([jsonString]);
      const compressedJsonBlob = await gzipBlob(jsonBlob);
      socket.send(compressedJsonBlob);
    },
    [socket]
  );

  const reviveUnitsWithPattern = useCallback(
    (coordinate: CoordinateVO, patternOffset: OffsetVO, pattern: UnitPatternVO) => {
      if (!socket || socket.readyState !== socket.OPEN) {
        return;
      }

      const coordinates: CoordinateVO[] = [];
      pattern.forEach((patternCol, colIdx) => {
        patternCol.forEach((isTruthy, rowIdx) => {
          if (isTruthy) {
            coordinates.push({
              x: coordinate.x + colIdx + patternOffset.x,
              y: coordinate.y + rowIdx + patternOffset.y,
            });
          }
        });
      });

      const action: ReviveUnitsAction = {
        type: ActionTypeEnum.ReviveUnits,
        payload: {
          coordinates,
        },
      };
      sendMessage(action);
    },
    [socket, status]
  );

  const sendWatchAreaAction = useCallback(
    (newArea: AreaDTO) => {
      if (!socket || socket.readyState !== socket.OPEN) {
        return;
      }

      const action: WatchAreaAction = {
        type: ActionTypeEnum.WatchArea,
        payload: {
          area: newArea,
        },
      };
      sendMessage(action);
    },
    [socket, status]
  );
  const sendWatchAreaActionDebouncer = useCallback(
    debounce(sendWatchAreaAction, 50, { leading: true, maxWait: 250, trailing: true }),
    [sendWatchAreaAction]
  );
  const watchArea = useCallback(
    (newArea: AreaDTO) => {
      setTargetArea(newArea);
      sendWatchAreaActionDebouncer(newArea);
    },
    [sendWatchAreaActionDebouncer]
  );

  const joinGame = useCallback(() => {
    if (socket) {
      return;
    }

    const schema = process.env.NODE_ENV === 'production' ? 'wss' : 'ws';
    const newSocket = new WebSocket(`${schema}://${process.env.API_DOMAIN}/ws/game/`);
    setSocket(newSocket);
  }, [socket]);

  const leaveGame = useCallback(() => {
    if (!socket) {
      return;
    }
    if (socket.readyState === socket.CLOSING) {
      return;
    }

    socket.close();
  }, [socket]);

  useEffect(() => {
    if (!socket) {
      return;
    }

    socket.onopen = () => {
      setStatus('ONLINE');
    };

    socket.onclose = () => {
      resetContext();
      setStatus('OFFLINE');
      setSocket(null);
    };

    socket.onmessage = async (evt: any) => {
      const decompressedBlob = await ungzipBlob(evt.data as Blob);
      const eventJsonString = await decompressedBlob.text();

      const event: Event = JSON.parse(eventJsonString);
      if (event.type === EventTypeEnum.CoordinatesUpdated) {
        if (!displayedArea || !unitMap) {
          return;
        }
        const newUnitMap = cloneDeep(unitMap);
        event.payload.coordinates.forEach((coord, idx) => {
          const colIdx = coord.x - displayedArea.from.x;
          const rowIdx = coord.y - displayedArea.from.y;
          newUnitMap[colIdx][rowIdx] = {
            ...newUnitMap[colIdx][rowIdx],
            ...event.payload.units[idx],
          };
        });

        setUnitMap(newUnitMap);
      } else if (event.type === EventTypeEnum.AreaUpdated) {
        if (!isEqual(displayedArea, event.payload.area)) {
          setDisplayedArea(event.payload.area);
        }
        setUnitMap(convertAreaUpdatedEventPayloadToUnitEntities(event.payload));
      } else if (event.type === EventTypeEnum.InformationUpdated) {
        setMapSize(event.payload.mapSize);
      }
    };
  }, [socket, unitMap]);

  const gameRoomContextValue = useMemo<GameRoomContextValue>(
    () => ({
      status,
      mapSize,
      displayedArea,
      targetArea,
      unitMap,
      unitPattern,
      joinGame,
      updateUnitPattern,
      reviveUnitsWithPattern,
      watchArea,
      leaveGame,
    }),
    [
      status,
      mapSize,
      displayedArea,
      targetArea,
      unitMap,
      unitPattern,
      joinGame,
      updateUnitPattern,
      reviveUnitsWithPattern,
      watchArea,
      leaveGame,
    ]
  );

  return <GameRoomContext.Provider value={gameRoomContextValue}>{children}</GameRoomContext.Provider>;
}

export default GameRoomContext;
