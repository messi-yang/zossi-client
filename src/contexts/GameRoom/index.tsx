import { createContext, useCallback, useState, useMemo, useRef } from 'react';
import debounce from 'lodash/debounce';
import useWebSocket from '@/hooks/useWebSocket';
import type { UnitDto, CoordinateDto } from '@/dtos';
import { AreaVo, UnitVo, UnitMapVo, CoordinateVo, MapSizeVo, OffsetVo, UnitPatternVo } from '@/valueObjects';
import { generateAreaOffset } from '@/valueObjects/factories';
import { EventTypeEnum, AreaZoomedEvent, ZoomedAreaUpdatedEvent, InformationUpdatedEvent } from './eventTypes';
import type { Event } from './eventTypes';
import { ActionTypeEnum } from './actionTypes';
import type { ZoomAreaAction, ReviveUnitsAction } from './actionTypes';

type Status = 'CLOSED' | 'CLOSING' | 'CONNECTING' | 'CONNECTED';

function convertUnitDtoMatrixToUnitMapVo(unitMap: UnitDto[][]): UnitMapVo {
  const unitMatrix = unitMap.map((unitCol) => unitCol.map((unit) => new UnitVo(unit.alive, unit.age)));
  return new UnitMapVo(unitMatrix);
}

type GameRoomContextValue = {
  status: Status;
  mapSize: MapSizeVo | null;
  zoomedArea: AreaVo | null;
  targetArea: AreaVo | null;
  unitMap: UnitMapVo | null;
  zoomedAreaOffset: OffsetVo;
  unitPattern: UnitPatternVo;
  joinGame: () => void;
  updateUnitPattern: (pattern: UnitPatternVo) => void;
  reviveUnitsWithPattern: (coordinate: CoordinateVo, unitPatternOffset: OffsetVo, unitPattern: UnitPatternVo) => void;
  zoomArea: (area: AreaVo) => void;
  leaveGame: () => void;
};

function createInitialGameRoomContextValue(): GameRoomContextValue {
  return {
    status: 'CLOSED',
    mapSize: null,
    zoomedArea: null,
    targetArea: null,
    unitMap: null,
    zoomedAreaOffset: new OffsetVo(0, 0),
    unitPattern: new UnitPatternVo([
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
  const [mapSize, setMapSize] = useState<MapSizeVo | null>(initialGameRoomContextValue.mapSize);

  const zoomedAreaSource = useRef<AreaVo | null>(initialGameRoomContextValue.zoomedArea);
  const targetAreaSource = useRef<AreaVo | null>(initialGameRoomContextValue.targetArea);
  const unitMapSource = useRef<UnitMapVo | null>(initialGameRoomContextValue.unitMap);
  const [zoomedArea, setZoomedArea] = useState<AreaVo | null>(zoomedAreaSource.current);
  const [targetArea, setTargetArea] = useState<AreaVo | null>(targetAreaSource.current);
  const [unitMap, setUnitMap] = useState<UnitMapVo | null>(unitMapSource.current);
  const [zoomedAreaOffset, setZoomedAreaOffset] = useState<OffsetVo>(
    generateAreaOffset(zoomedAreaSource.current, targetAreaSource.current)
  );

  const [unitPattern, setUnitPattern] = useState<UnitPatternVo>(initialGameRoomContextValue.unitPattern);

  const updateUnitPattern = useCallback((newUnitPattern: UnitPatternVo) => {
    setUnitPattern(newUnitPattern);
  }, []);

  const handleSocketOpen = useCallback(() => {}, []);

  const updateUnitMapAndOffsets = useCallback(() => {
    setUnitMap(unitMapSource.current);
    setTargetArea(targetAreaSource.current);
    setZoomedArea(zoomedAreaSource.current);
    setZoomedAreaOffset(generateAreaOffset(zoomedAreaSource.current, targetAreaSource.current));
  }, []);
  const updateUnitMapAndOffsetsDebouncer = useCallback(
    debounce(updateUnitMapAndOffsets, 150, {
      leading: true,
      maxWait: 150,
    }),
    []
  );

  const handleAreaZoomedEvent = useCallback((event: AreaZoomedEvent) => {
    const newArea = new AreaVo(
      new CoordinateVo(event.payload.area.from.x, event.payload.area.from.y),
      new CoordinateVo(event.payload.area.to.x, event.payload.area.to.y)
    );
    if (!zoomedAreaSource.current || !zoomedAreaSource.current.isEqual(newArea)) {
      zoomedAreaSource.current = newArea;
    }
    unitMapSource.current = convertUnitDtoMatrixToUnitMapVo(event.payload.unitMap);
    updateUnitMapAndOffsetsDebouncer.cancel();
    updateUnitMapAndOffsetsDebouncer();
  }, []);

  const handleZoomedAreaUpdatedEvent = useCallback((event: ZoomedAreaUpdatedEvent) => {
    const newArea = new AreaVo(
      new CoordinateVo(event.payload.area.from.x, event.payload.area.from.y),
      new CoordinateVo(event.payload.area.to.x, event.payload.area.to.y)
    );
    if (!zoomedAreaSource.current || !zoomedAreaSource.current.isEqual(newArea)) {
      zoomedAreaSource.current = newArea;
    }

    unitMapSource.current = convertUnitDtoMatrixToUnitMapVo(event.payload.unitMap);
    updateUnitMapAndOffsetsDebouncer();
  }, []);

  const handleInformationUpdatedEvent = useCallback((event: InformationUpdatedEvent) => {
    setMapSize(new MapSizeVo(event.payload.mapSize.width, event.payload.mapSize.height));
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
    (coordinate: CoordinateVo, patternOffset: OffsetVo, pattern: UnitPatternVo) => {
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
    (newArea: AreaVo) => {
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
    debounce(sendZoomAreaAction, 50, { leading: true, maxWait: 250, trailing: true }),
    [sendZoomAreaAction]
  );
  const zoomArea = useCallback(
    (newArea: AreaVo) => {
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
