import { createContext, useCallback, useState, useMemo, useRef } from 'react';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';
import useWebSocket from '@/hooks/useWebSocket';
import type { AreaDTO, UnitDTO, MapSizeDTO, CoordinateDTO } from '@/dto';
import type { UnitVO, CoordinateVO, OffsetVO, UnitPatternVO } from '@/valueObjects';
import { EventTypeEnum, AreaZoomedEvent, ZoomedAreaUpdatedEvent, InformationUpdatedEvent } from './eventTypes';
import type { Event } from './eventTypes';
import { ActionTypeEnum } from './actionTypes';
import type { ZoomAreaAction, ReviveUnitsAction } from './actionTypes';

type Status = 'CLOSED' | 'CLOSING' | 'CONNECTING' | 'CONNECTED';

function calculateZoomedAreaOffset(zoomedArea: AreaDTO | null, targetArea: AreaDTO | null): OffsetVO {
  if (!zoomedArea || !targetArea) {
    return { x: 0, y: 0 };
  }
  return {
    x: zoomedArea.from.x - targetArea.from.x,
    y: zoomedArea.from.y - targetArea.from.y,
  };
}

function convertAreaAndUnitMapIntoUnitVOMap(area: AreaDTO, unitMap: UnitDTO[][]): UnitVO[][] {
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
  zoomedArea: AreaDTO | null;
  targetArea: AreaDTO | null;
  unitMap: UnitVO[][] | null;
  zoomedAreaOffset: OffsetVO;
  unitPattern: UnitPatternVO;
  joinGame: () => void;
  updateUnitPattern: (pattern: UnitPatternVO) => void;
  reviveUnitsWithPattern: (coordinate: CoordinateVO, unitPatternOffset: OffsetVO, unitPattern: UnitPatternVO) => void;
  zoomArea: (area: AreaDTO) => void;
  leaveGame: () => void;
};

function createInitialGameRoomContextValue(): GameRoomContextValue {
  return {
    status: 'CLOSED',
    mapSize: null,
    zoomedArea: null,
    targetArea: null,
    unitMap: null,
    zoomedAreaOffset: { x: 0, y: 0 },
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
    zoomArea: () => {},
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

  const zoomedAreaSource = useRef<AreaDTO | null>(initialGameRoomContextValue.zoomedArea);
  const targetAreaSource = useRef<AreaDTO | null>(initialGameRoomContextValue.targetArea);
  const unitMapSource = useRef<UnitVO[][] | null>(initialGameRoomContextValue.unitMap);
  const [zoomedArea, setZoomedArea] = useState<AreaDTO | null>(zoomedAreaSource.current);
  const [targetArea, setTargetArea] = useState<AreaDTO | null>(targetAreaSource.current);
  const [unitMap, setUnitMap] = useState<UnitVO[][] | null>(unitMapSource.current);
  const [zoomedAreaOffset, setZoomedAreaOffset] = useState<OffsetVO>(
    calculateZoomedAreaOffset(zoomedAreaSource.current, targetAreaSource.current)
  );

  const [unitPattern, setUnitPattern] = useState<UnitPatternVO>(initialGameRoomContextValue.unitPattern);

  const updateUnitPattern = useCallback((newUnitPattern: UnitPatternVO) => {
    setUnitPattern(newUnitPattern);
  }, []);

  const handleSocketOpen = useCallback(() => {}, []);

  const updateUnitMapAndOffsets = useCallback(() => {
    setUnitMap(unitMapSource.current);
    setTargetArea(targetAreaSource.current);
    setZoomedArea(zoomedAreaSource.current);
    setZoomedAreaOffset(calculateZoomedAreaOffset(zoomedAreaSource.current, targetAreaSource.current));
  }, []);
  const updateUnitMapAndOffsetsDebouncer = useCallback(
    debounce(updateUnitMapAndOffsets, 150, {
      leading: true,
      maxWait: 150,
    }),
    []
  );

  const handleAreaZoomedEvent = useCallback((event: AreaZoomedEvent) => {
    if (!isEqual(zoomedAreaSource.current, event.payload.area)) {
      zoomedAreaSource.current = event.payload.area;
    }
    unitMapSource.current = convertAreaAndUnitMapIntoUnitVOMap(event.payload.area, event.payload.unitMap);
    updateUnitMapAndOffsetsDebouncer.cancel();
    updateUnitMapAndOffsetsDebouncer();
  }, []);

  const handleZoomedAreaUpdatedEvent = useCallback((event: ZoomedAreaUpdatedEvent) => {
    if (!isEqual(zoomedAreaSource.current, event.payload.area)) {
      zoomedAreaSource.current = event.payload.area;
    }

    unitMapSource.current = convertAreaAndUnitMapIntoUnitVOMap(event.payload.area, event.payload.unitMap);
    updateUnitMapAndOffsetsDebouncer();
  }, []);

  const handleInformationUpdatedEvent = useCallback((event: InformationUpdatedEvent) => {
    setMapSize(event.payload.mapSize);
  }, []);

  const handleSocketMessage = useCallback(
    (msg: any) => {
      const newMsg: Event = msg;
      if (newMsg.type === EventTypeEnum.AreaZoomed) {
        handleAreaZoomedEvent(newMsg);
      } else if (newMsg.type === EventTypeEnum.ZoomedAreaUpdated) {
        handleZoomedAreaUpdatedEvent(newMsg);
      } else if (newMsg.type === EventTypeEnum.InformationUpdated) {
        handleInformationUpdatedEvent(newMsg);
      }
    },
    [unitMap, handleAreaZoomedEvent, handleZoomedAreaUpdatedEvent, handleInformationUpdatedEvent]
  );

  const resetContext = useCallback(() => {
    setMapSize(initialGameRoomContextValue.mapSize);
    setTargetArea(initialGameRoomContextValue.targetArea);

    zoomedAreaSource.current = initialGameRoomContextValue.zoomedArea;
    targetAreaSource.current = initialGameRoomContextValue.targetArea;
    unitMapSource.current = initialGameRoomContextValue.unitMap;
    updateUnitMapAndOffsetsDebouncer();

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
          actionedAt: new Date().toISOString(),
        },
      };
      sendMessage(action);
    },
    [mapSize, sendMessage]
  );

  const sendZoomAreaAction = useCallback(
    (newArea: AreaDTO) => {
      const action: ZoomAreaAction = {
        type: ActionTypeEnum.ZoomArea,
        payload: {
          area: newArea,
          actionedAt: new Date().toISOString(),
        },
      };
      sendMessage(action);
    },
    [sendMessage]
  );
  const sendZoomAreaActionDebouncer = useCallback(
    debounce(sendZoomAreaAction, 50, { leading: true, maxWait: 250, trailing: true }),
    [sendZoomAreaAction]
  );
  const zoomArea = useCallback(
    (newArea: AreaDTO) => {
      targetAreaSource.current = newArea;
      updateUnitMapAndOffsetsDebouncer();
      sendZoomAreaActionDebouncer(newArea);
    },
    [sendZoomAreaActionDebouncer]
  );

  const gameRoomContextValue = useMemo<GameRoomContextValue>(
    () => ({
      status,
      mapSize,
      zoomedArea,
      zoomedAreaOffset,
      targetArea,
      unitMap,
      unitPattern,
      joinGame,
      leaveGame,
      updateUnitPattern,
      reviveUnitsWithPattern,
      zoomArea,
    }),
    [
      status,
      mapSize,
      zoomedArea,
      zoomedAreaOffset,
      targetArea,
      unitMap,
      unitPattern,
      joinGame,
      leaveGame,
      updateUnitPattern,
      reviveUnitsWithPattern,
      zoomArea,
    ]
  );

  return <GameRoomContext.Provider value={gameRoomContextValue}>{children}</GameRoomContext.Provider>;
}

export default GameRoomContext;
