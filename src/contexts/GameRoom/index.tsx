import { createContext, useCallback, useState, useMemo, useRef } from 'react';
import debounce from 'lodash/debounce';
import useWebSocket from '@/hooks/useWebSocket';
import type { UnitDto, CoordinateDto } from '@/dtos';
import {
  AreaValueObject,
  UnitMapValueObject,
  CoordinateValueObject,
  MapSizeValueObject,
  OffsetValueObject,
  UnitPatternValueObject,
} from '@/valueObjects';
import {
  createCoordinate,
  createArea,
  createMapSize,
  createOffset,
  createUnit,
  createUnitMap,
  createUnitPattern,
  createOffsetOfTwoAreas,
} from '@/valueObjects/factories';
import { EventTypeEnum, AreaZoomedEvent, ZoomedAreaUpdatedEvent, InformationUpdatedEvent } from './eventTypes';
import type { Event } from './eventTypes';
import { ActionTypeEnum } from './actionTypes';
import type { ZoomAreaAction, ReviveUnitsAction } from './actionTypes';

type Status = 'CLOSED' | 'CLOSING' | 'CONNECTING' | 'CONNECTED';

function convertUnitDtoMatrixToUnitMapValueObject(unitMap: UnitDto[][]): UnitMapValueObject {
  const unitMatrix = unitMap.map((unitCol) => unitCol.map((unit) => createUnit(unit.alive, unit.age)));
  return createUnitMap(unitMatrix);
}

type GameRoomContextValue = {
  status: Status;
  mapSize: MapSizeValueObject | null;
  zoomedArea: AreaValueObject | null;
  targetArea: AreaValueObject | null;
  unitMap: UnitMapValueObject | null;
  zoomedAreaOffset: OffsetValueObject;
  unitPattern: UnitPatternValueObject;
  joinGame: () => void;
  updateUnitPattern: (pattern: UnitPatternValueObject) => void;
  reviveUnitsWithPattern: (
    coordinate: CoordinateValueObject,
    unitPatternOffset: OffsetValueObject,
    unitPattern: UnitPatternValueObject
  ) => void;
  zoomArea: (area: AreaValueObject) => void;
  leaveGame: () => void;
};

function createInitialGameRoomContextValue(): GameRoomContextValue {
  return {
    status: 'CLOSED',
    mapSize: null,
    zoomedArea: null,
    targetArea: null,
    unitMap: null,
    zoomedAreaOffset: createOffset(0, 0),
    unitPattern: createUnitPattern([
      [false, false, false, false, false],
      [false, false, true, false, false],
      [false, true, false, true, false],
      [false, false, true, false, false],
      [false, false, false, false, false],
    ]),
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
  const [mapSize, setMapSize] = useState<MapSizeValueObject | null>(initialGameRoomContextValue.mapSize);

  const zoomedAreaSource = useRef<AreaValueObject | null>(initialGameRoomContextValue.zoomedArea);
  const targetAreaSource = useRef<AreaValueObject | null>(initialGameRoomContextValue.targetArea);
  const unitMapSource = useRef<UnitMapValueObject | null>(initialGameRoomContextValue.unitMap);
  const [zoomedArea, setZoomedArea] = useState<AreaValueObject | null>(zoomedAreaSource.current);
  const [targetArea, setTargetArea] = useState<AreaValueObject | null>(targetAreaSource.current);
  const [unitMap, setUnitMap] = useState<UnitMapValueObject | null>(unitMapSource.current);
  const [zoomedAreaOffset, setZoomedAreaOffset] = useState<OffsetValueObject>(
    createOffsetOfTwoAreas(zoomedAreaSource.current, targetAreaSource.current)
  );

  const [unitPattern, setUnitPattern] = useState<UnitPatternValueObject>(initialGameRoomContextValue.unitPattern);

  const updateUnitPattern = useCallback((newUnitPattern: UnitPatternValueObject) => {
    setUnitPattern(newUnitPattern);
  }, []);

  const handleSocketOpen = useCallback(() => {}, []);

  const updateUnitMapAndOffsets = useCallback(() => {
    setUnitMap(unitMapSource.current);
    setTargetArea(targetAreaSource.current);
    setZoomedArea(zoomedAreaSource.current);
    setZoomedAreaOffset(createOffsetOfTwoAreas(zoomedAreaSource.current, targetAreaSource.current));
  }, []);
  const updateUnitMapAndOffsetsDebouncer = useCallback(
    debounce(updateUnitMapAndOffsets, 50, {
      leading: true,
      maxWait: 50,
    }),
    []
  );

  const handleAreaZoomedEvent = useCallback((event: AreaZoomedEvent) => {
    const newArea = createArea(
      createCoordinate(event.payload.area.from.x, event.payload.area.from.y),
      createCoordinate(event.payload.area.to.x, event.payload.area.to.y)
    );
    if (!zoomedAreaSource.current || !zoomedAreaSource.current.isEqual(newArea)) {
      zoomedAreaSource.current = newArea;
    }
    unitMapSource.current = convertUnitDtoMatrixToUnitMapValueObject(event.payload.unitMap);
    updateUnitMapAndOffsetsDebouncer.cancel();
    updateUnitMapAndOffsetsDebouncer();
  }, []);

  const handleZoomedAreaUpdatedEvent = useCallback((event: ZoomedAreaUpdatedEvent) => {
    const newArea = createArea(
      createCoordinate(event.payload.area.from.x, event.payload.area.from.y),
      createCoordinate(event.payload.area.to.x, event.payload.area.to.y)
    );
    if (!zoomedAreaSource.current || !zoomedAreaSource.current.isEqual(newArea)) {
      zoomedAreaSource.current = newArea;
    }

    unitMapSource.current = convertUnitDtoMatrixToUnitMapValueObject(event.payload.unitMap);
    updateUnitMapAndOffsetsDebouncer();
  }, []);

  const handleInformationUpdatedEvent = useCallback((event: InformationUpdatedEvent) => {
    setMapSize(createMapSize(event.payload.mapSize.width, event.payload.mapSize.height));
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
    (coordinate: CoordinateValueObject, patternOffset: OffsetValueObject, pattern: UnitPatternValueObject) => {
      const normalizeCoordinate = (c: CoordinateDto) => {
        if (!mapSize) {
          return c;
        }
        let normalizedX = c.x;
        let normalizedY = c.y;
        while (normalizedX < 0) {
          normalizedX += mapSize.getWidth();
        }
        while (normalizedY < 0) {
          normalizedY += mapSize.getHeight();
        }
        return {
          x: normalizedX % mapSize.getWidth(),
          y: normalizedY % mapSize.getHeight(),
        };
      };

      const coordinates: CoordinateDto[] = [];
      pattern.iterate((colIdx: number, rowIdx: number, alive: boolean) => {
        if (alive) {
          coordinates.push({
            x: coordinate.getX() + colIdx + patternOffset.getX(),
            y: coordinate.getY() + rowIdx + patternOffset.getY(),
          });
        }
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
    (newArea: AreaValueObject) => {
      const action: ZoomAreaAction = {
        type: ActionTypeEnum.ZoomArea,
        payload: {
          area: {
            from: { x: newArea.getFrom().getX(), y: newArea.getFrom().getY() },
            to: { x: newArea.getTo().getX(), y: newArea.getTo().getY() },
          },
          actionedAt: new Date().toISOString(),
        },
      };
      sendMessage(action);
    },
    [sendMessage]
  );
  const sendZoomAreaActionDebouncer = useCallback(
    debounce(sendZoomAreaAction, 150, { leading: true, maxWait: 500, trailing: true }),
    [sendZoomAreaAction]
  );
  const zoomArea = useCallback(
    (newArea: AreaValueObject) => {
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
