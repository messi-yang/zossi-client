import { createContext, useCallback, useState, useMemo } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import useWebSocket from '@/hooks/useWebSocket';
import type { AreaDTO, MapSizeDTO, CoordinateDTO } from '@/dto';
import type { UnitVO, CoordinateVO, OffsetVO, UnitPatternVO } from '@/valueObjects';
import { EventTypeEnum } from './eventTypes';
import type { Event, UnitMapFetchedEventPayload } from './eventTypes';
import { ActionTypeEnum } from './actionTypes';
import type { WatchAreaAction, ReviveUnitsAction } from './actionTypes';

type Status = 'CLOSED' | 'CLOSING' | 'CONNECTING' | 'CONNECTED';

function convertUnitMapFetchedEventPayloadToUnitEntities({ area, unitMap }: UnitMapFetchedEventPayload): UnitVO[][] {
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
    status: 'CLOSED',
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
  const schema = process.env.NODE_ENV === 'production' ? 'wss' : 'ws';
  const socketUrl = `${schema}://${process.env.API_DOMAIN}/ws/game/`;

  const initialGameRoomContextValue = createInitialGameRoomContextValue();
  const [mapSize, setMapSize] = useState<MapSizeDTO | null>(initialGameRoomContextValue.mapSize);
  const [displayedArea, setDisplayedArea] = useState<AreaDTO | null>(initialGameRoomContextValue.displayedArea);
  const [targetArea, setTargetArea] = useState<AreaDTO | null>(initialGameRoomContextValue.targetArea);
  const [unitMap, setUnitMap] = useState<UnitVO[][] | null>(initialGameRoomContextValue.unitMap);
  const [unitPattern, setUnitPattern] = useState<UnitPatternVO>(initialGameRoomContextValue.unitPattern);

  const updateUnitPattern = useCallback((newUnitPattern: UnitPatternVO) => {
    setUnitPattern(newUnitPattern);
  }, []);

  const handleSocketOpen = useCallback(() => {}, []);

  const handleSocketMessage = useCallback(
    (msg: any) => {
      const newMsg: Event = msg;
      if (newMsg.type === EventTypeEnum.UnitsUpdated) {
        if (!displayedArea || !unitMap) {
          return;
        }
        const newUnitMap = cloneDeep(unitMap);
        newMsg.payload.coordinates.forEach((coord, idx) => {
          const colIdx = coord.x - displayedArea.from.x;
          const rowIdx = coord.y - displayedArea.from.y;
          newUnitMap[colIdx][rowIdx] = {
            ...newUnitMap[colIdx][rowIdx],
            ...newMsg.payload.units[idx],
          };
        });

        setUnitMap(newUnitMap);
      } else if (newMsg.type === EventTypeEnum.UnitMapFetched) {
        if (!isEqual(displayedArea, newMsg.payload.area)) {
          setDisplayedArea(newMsg.payload.area);
        }
        setUnitMap(convertUnitMapFetchedEventPayloadToUnitEntities(newMsg.payload));
      } else if (newMsg.type === EventTypeEnum.InformationUpdated) {
        setMapSize(newMsg.payload.mapSize);
      }
    },
    [unitMap, displayedArea]
  );

  const resetContext = useCallback(() => {
    setMapSize(initialGameRoomContextValue.mapSize);
    setDisplayedArea(initialGameRoomContextValue.displayedArea);
    setTargetArea(initialGameRoomContextValue.targetArea);
    setUnitMap(initialGameRoomContextValue.unitMap);
    setUnitPattern(initialGameRoomContextValue.unitPattern);
  }, []);

  const handleSocketClose = () => {
    resetContext();
  };

  const { status, connect, sendMessage, disconnect } = useWebSocket(socketUrl, {
    onOpen: handleSocketOpen,
    onMessage: handleSocketMessage,
    onClose: handleSocketClose,
  });

  const joinGame = useCallback(() => {
    connect();
  }, [connect]);

  const leaveGame = useCallback(() => {
    disconnect();
  }, [disconnect]);

  const reviveUnitsWithPattern = useCallback(
    (coordinate: CoordinateVO, patternOffset: OffsetVO, pattern: UnitPatternVO) => {
      const normalizeCoordinate = (c: CoordinateDTO) => {
        if (!mapSize) {
          return c;
        }
        let normalizedX = c.x;
        let normalizedY = c.y;
        while (normalizedX < 0) {
          normalizedX += mapSize.width;
        }
        while (normalizedY < 0) {
          normalizedY += mapSize.height;
        }
        return {
          x: normalizedX % mapSize.width,
          y: normalizedY % mapSize.height,
        };
      };

      const coordinates: CoordinateDTO[] = [];
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
          coordinates: coordinates.map(normalizeCoordinate),
        },
      };
      sendMessage(action);
    },
    [mapSize, sendMessage]
  );

  const sendWatchAreaAction = useCallback(
    (newArea: AreaDTO) => {
      const action: WatchAreaAction = {
        type: ActionTypeEnum.WatchArea,
        payload: {
          area: newArea,
        },
      };
      sendMessage(action);
    },
    [sendMessage]
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

  const gameRoomContextValue = useMemo<GameRoomContextValue>(
    () => ({
      status,
      mapSize,
      displayedArea,
      targetArea,
      unitMap,
      unitPattern,
      joinGame,
      leaveGame,
      updateUnitPattern,
      reviveUnitsWithPattern,
      watchArea,
    }),
    [
      status,
      mapSize,
      displayedArea,
      targetArea,
      unitMap,
      unitPattern,
      joinGame,
      leaveGame,
      updateUnitPattern,
      reviveUnitsWithPattern,
      watchArea,
    ]
  );

  return <GameRoomContext.Provider value={gameRoomContextValue}>{children}</GameRoomContext.Provider>;
}

export default GameRoomContext;
