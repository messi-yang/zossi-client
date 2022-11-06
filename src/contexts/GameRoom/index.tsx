import { createContext, useCallback, useState, useMemo, useRef } from 'react';
import debounce from 'lodash/debounce';
import useWebSocket from '@/hooks/useWebSocket';
import type { UnitDto, CoordinateDto } from '@/dtos';
import {
  AreaValueObject,
  UnitBlockValueObject,
  CoordinateValueObject,
  DimensionValueObject,
  OffsetValueObject,
  UnitPatternValueObject,
} from '@/valueObjects';
import {
  createCoordinate,
  createArea,
  createDimension,
  createOffset,
  createUnit,
  createUnitBlock,
  createUnitPattern,
  createOffsetOfTwoAreas,
} from '@/valueObjects/factories';
import { EventTypeEnum, AreaZoomedEvent, ZoomedAreaUpdatedEvent, InformationUpdatedEvent } from './eventTypes';
import type { Event } from './eventTypes';
import { ActionTypeEnum } from './actionTypes';
import type { ZoomAreaAction, ReviveUnitsAction } from './actionTypes';

type Status = 'CLOSED' | 'CLOSING' | 'CONNECTING' | 'CONNECTED';

function convertUnitDtoMatrixToUnitBlockValueObject(unitBlock: UnitDto[][]): UnitBlockValueObject {
  const unitMatrix = unitBlock.map((unitCol) => unitCol.map((unit) => createUnit(unit.alive)));
  return createUnitBlock(unitMatrix);
}

type GameRoomContextValue = {
  status: Status;
  dimension: DimensionValueObject | null;
  zoomedArea: AreaValueObject | null;
  targetArea: AreaValueObject | null;
  unitBlock: UnitBlockValueObject | null;
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
    dimension: null,
    zoomedArea: null,
    targetArea: null,
    unitBlock: null,
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
  const [dimension, setDimension] = useState<DimensionValueObject | null>(initialGameRoomContextValue.dimension);

  const zoomedAreaSource = useRef<AreaValueObject | null>(initialGameRoomContextValue.zoomedArea);
  const targetAreaSource = useRef<AreaValueObject | null>(initialGameRoomContextValue.targetArea);
  const unitBlockSource = useRef<UnitBlockValueObject | null>(initialGameRoomContextValue.unitBlock);
  const [zoomedArea, setZoomedArea] = useState<AreaValueObject | null>(zoomedAreaSource.current);
  const [targetArea, setTargetArea] = useState<AreaValueObject | null>(targetAreaSource.current);
  const [unitBlock, setUnitBlock] = useState<UnitBlockValueObject | null>(unitBlockSource.current);
  const [zoomedAreaOffset, setZoomedAreaOffset] = useState<OffsetValueObject>(
    createOffsetOfTwoAreas(zoomedAreaSource.current, targetAreaSource.current)
  );

  const [unitPattern, setUnitPattern] = useState<UnitPatternValueObject>(initialGameRoomContextValue.unitPattern);

  const updateUnitPattern = useCallback((newUnitPattern: UnitPatternValueObject) => {
    setUnitPattern(newUnitPattern);
  }, []);

  const handleSocketOpen = useCallback(() => {}, []);

  const updateUnitBlockAndOffsets = useCallback(() => {
    setUnitBlock(unitBlockSource.current);
    setTargetArea(targetAreaSource.current);
    setZoomedArea(zoomedAreaSource.current);
    setZoomedAreaOffset(createOffsetOfTwoAreas(zoomedAreaSource.current, targetAreaSource.current));
  }, []);
  const updateUnitBlockAndOffsetsDebouncer = useCallback(
    debounce(updateUnitBlockAndOffsets, 50, {
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
    unitBlockSource.current = convertUnitDtoMatrixToUnitBlockValueObject(event.payload.unitBlock);
    updateUnitBlockAndOffsetsDebouncer.cancel();
    updateUnitBlockAndOffsetsDebouncer();
  }, []);

  const handleZoomedAreaUpdatedEvent = useCallback((event: ZoomedAreaUpdatedEvent) => {
    const newArea = createArea(
      createCoordinate(event.payload.area.from.x, event.payload.area.from.y),
      createCoordinate(event.payload.area.to.x, event.payload.area.to.y)
    );
    if (!zoomedAreaSource.current || !zoomedAreaSource.current.isEqual(newArea)) {
      zoomedAreaSource.current = newArea;
    }

    unitBlockSource.current = convertUnitDtoMatrixToUnitBlockValueObject(event.payload.unitBlock);
    updateUnitBlockAndOffsetsDebouncer();
  }, []);

  const handleInformationUpdatedEvent = useCallback((event: InformationUpdatedEvent) => {
    setDimension(createDimension(event.payload.dimension.width, event.payload.dimension.height));
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
    [unitBlock, handleAreaZoomedEvent, handleZoomedAreaUpdatedEvent, handleInformationUpdatedEvent]
  );

  const resetContext = useCallback(() => {
    setDimension(initialGameRoomContextValue.dimension);
    setTargetArea(initialGameRoomContextValue.targetArea);

    zoomedAreaSource.current = initialGameRoomContextValue.zoomedArea;
    targetAreaSource.current = initialGameRoomContextValue.targetArea;
    unitBlockSource.current = initialGameRoomContextValue.unitBlock;
    updateUnitBlockAndOffsetsDebouncer();

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
        if (!dimension) {
          return c;
        }
        let normalizedX = c.x;
        let normalizedY = c.y;
        while (normalizedX < 0) {
          normalizedX += dimension.getWidth();
        }
        while (normalizedY < 0) {
          normalizedY += dimension.getHeight();
        }
        return {
          x: normalizedX % dimension.getWidth(),
          y: normalizedY % dimension.getHeight(),
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
    [dimension, sendMessage]
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
      updateUnitBlockAndOffsetsDebouncer();
      sendZoomAreaActionDebouncer(newArea);
    },
    [sendZoomAreaActionDebouncer]
  );

  const gameRoomContextValue = useMemo<GameRoomContextValue>(
    () => ({
      status,
      dimension,
      zoomedArea,
      zoomedAreaOffset,
      targetArea,
      unitBlock,
      unitPattern,
      joinGame,
      leaveGame,
      updateUnitPattern,
      reviveUnitsWithPattern,
      zoomArea,
    }),
    [
      status,
      dimension,
      zoomedArea,
      zoomedAreaOffset,
      targetArea,
      unitBlock,
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
