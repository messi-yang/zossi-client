import { createContext, useCallback, useState, useMemo, useRef } from 'react';
import debounce from 'lodash/debounce';
import useWebSocket from '@/hooks/useWebSocket';
import type { UnitDto } from '@/models/dtos';
import { AreaVo, UnitBlockVo, CoordinateVo, DimensionVo, OffsetVo } from '@/models/valueObjects';
import {
  createCoordinate,
  createArea,
  createDimension,
  createOffset,
  createUnit,
  createUnitBlock,
  createOffsetOfTwoAreas,
} from '@/models/valueObjects/factories';
import { EventTypeEnum, AreaZoomedEvent, ZoomedAreaUpdatedEvent, InformationUpdatedEvent } from './eventTypes';
import type { Event } from './eventTypes';
import { ActionTypeEnum } from './actionTypes';
import type { ZoomAreaAction, BuildItemAction } from './actionTypes';

type Status = 'CLOSED' | 'CLOSING' | 'CONNECTING' | 'CONNECTED';

function convertUnitDtoMatrixToUnitBlockVo(unitBlock: UnitDto[][]): UnitBlockVo {
  const unitMatrix = unitBlock.map((unitCol) => unitCol.map((unit) => createUnit(unit.alive)));
  return createUnitBlock(unitMatrix);
}

type ContextValue = {
  status: Status;
  dimension: DimensionVo | null;
  zoomedArea: AreaVo | null;
  targetArea: AreaVo | null;
  unitBlock: UnitBlockVo | null;
  zoomedAreaOffset: OffsetVo;
  joinGame: () => void;
  buildItem: (coordinate: CoordinateVo, itemId: string) => void;
  zoomArea: (area: AreaVo) => void;
  leaveGame: () => void;
};

function createInitialContextValue(): ContextValue {
  return {
    status: 'CLOSED',
    dimension: null,
    zoomedArea: null,
    targetArea: null,
    unitBlock: null,
    zoomedAreaOffset: createOffset(0, 0),
    joinGame: () => {},
    buildItem: () => {},
    zoomArea: () => {},
    leaveGame: () => {},
  };
}

const Context = createContext<ContextValue>(createInitialContextValue());

type Props = {
  children: JSX.Element;
};

export function Provider({ children }: Props) {
  const schema = process.env.NODE_ENV === 'production' ? 'wss' : 'ws';
  const socketUrl = `${schema}://${process.env.API_DOMAIN}/ws/game/`;

  const initialContextValue = createInitialContextValue();
  const [dimension, setDimension] = useState<DimensionVo | null>(initialContextValue.dimension);

  const zoomedAreaSource = useRef<AreaVo | null>(initialContextValue.zoomedArea);
  const targetAreaSource = useRef<AreaVo | null>(initialContextValue.targetArea);
  const unitBlockSource = useRef<UnitBlockVo | null>(initialContextValue.unitBlock);
  const [zoomedArea, setZoomedArea] = useState<AreaVo | null>(zoomedAreaSource.current);
  const [targetArea, setTargetArea] = useState<AreaVo | null>(targetAreaSource.current);
  const [unitBlock, setUnitBlock] = useState<UnitBlockVo | null>(unitBlockSource.current);
  const [zoomedAreaOffset, setZoomedAreaOffset] = useState<OffsetVo>(
    createOffsetOfTwoAreas(zoomedAreaSource.current, targetAreaSource.current)
  );

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
    unitBlockSource.current = convertUnitDtoMatrixToUnitBlockVo(event.payload.unitBlock);
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

    unitBlockSource.current = convertUnitDtoMatrixToUnitBlockVo(event.payload.unitBlock);
    updateUnitBlockAndOffsetsDebouncer();
  }, []);

  const handleInformationUpdatedEvent = useCallback((event: InformationUpdatedEvent) => {
    setDimension(createDimension(event.payload.dimension.width, event.payload.dimension.height));
  }, []);

  const handleSocketMessage = useCallback(
    (msg: any) => {
      const newMsg: Event = msg;
      console.log(newMsg);
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
    setDimension(initialContextValue.dimension);
    setTargetArea(initialContextValue.targetArea);

    zoomedAreaSource.current = initialContextValue.zoomedArea;
    targetAreaSource.current = initialContextValue.targetArea;
    unitBlockSource.current = initialContextValue.unitBlock;
    updateUnitBlockAndOffsetsDebouncer();
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

  const buildItem = useCallback(
    (coordinate: CoordinateVo, itemId: string) => {
      const action: BuildItemAction = {
        type: ActionTypeEnum.BuildItem,
        payload: {
          coordinate: { x: coordinate.getX(), y: coordinate.getY() },
          itemId,
          actionedAt: new Date().toISOString(),
        },
      };
      sendMessage(action);
    },
    [sendMessage]
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
    debounce(sendZoomAreaAction, 150, { leading: true, maxWait: 500, trailing: true }),
    [sendZoomAreaAction]
  );
  const zoomArea = useCallback(
    (newArea: AreaVo) => {
      targetAreaSource.current = newArea;
      updateUnitBlockAndOffsetsDebouncer();
      sendZoomAreaActionDebouncer(newArea);
    },
    [sendZoomAreaActionDebouncer]
  );
  return (
    <Context.Provider
      value={useMemo<ContextValue>(
        () => ({
          status,
          dimension,
          zoomedArea,
          zoomedAreaOffset,
          targetArea,
          unitBlock,
          joinGame,
          leaveGame,
          buildItem,
          zoomArea,
        }),
        [
          status,
          dimension,
          zoomedArea,
          zoomedAreaOffset,
          targetArea,
          unitBlock,
          joinGame,
          leaveGame,
          buildItem,
          zoomArea,
        ]
      )}
    >
      {children}
    </Context.Provider>
  );
}

export default Context;
