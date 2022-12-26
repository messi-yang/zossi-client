import { createContext, useCallback, useState, useMemo, useRef, useEffect } from 'react';
import debounce from 'lodash/debounce';
import { ItemHttpApi } from '@/apis/httpApis';
import { GameSocketConn } from '@/apis/socketConnections';
import { AreaVo, UnitBlockVo, CoordinateVo, DimensionVo, OffsetVo } from '@/models/valueObjects';
import { ItemAgg } from '@/models/aggregates';
import { createOffset, createOffsetOfTwoAreas } from '@/models/valueObjects/factories';

type Status = 'CLOSED' | 'CLOSING' | 'CONNECTING' | 'CONNECTED';

type ContextValue = {
  status: Status;
  dimension: DimensionVo | null;
  zoomedArea: AreaVo | null;
  targetArea: AreaVo | null;
  unitBlock: UnitBlockVo | null;
  items: ItemAgg[] | null;
  selectedItem: ItemAgg | null;
  zoomedAreaOffset: OffsetVo;
  selectItem: (item: ItemAgg) => void;
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
    items: null,
    selectedItem: null,
    zoomedAreaOffset: createOffset(0, 0),
    selectItem: () => {},
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
  const itemHttpApi = ItemHttpApi.newItemHttpApi();
  const [gameSocketConn, setGameSocketConn] = useState<GameSocketConn | null>(null);
  const [status, setStatus] = useState<Status>('CLOSED');

  const initialContextValue = createInitialContextValue();
  const [dimension, setDimension] = useState<DimensionVo | null>(initialContextValue.dimension);

  const [items, setItems] = useState<ItemAgg[] | null>(initialContextValue.items);
  const [selectedItem, setSelectedItem] = useState<ItemAgg | null>(initialContextValue.selectedItem);
  const fetchItems = useCallback(async () => {
    const returnedItems = await itemHttpApi.fetchItems();
    setItems(returnedItems);
    setSelectedItem(returnedItems[0]);
  }, []);
  const fetchItemsOnInitializationEffect = useCallback(() => {
    fetchItems();
  }, [fetchItems]);
  useEffect(fetchItemsOnInitializationEffect, [fetchItemsOnInitializationEffect]);
  const selectItem = useCallback((item: ItemAgg) => {
    setSelectedItem(item);
  }, []);

  const zoomedAreaSource = useRef<AreaVo | null>(initialContextValue.zoomedArea);
  const targetAreaSource = useRef<AreaVo | null>(initialContextValue.targetArea);
  const unitBlockSource = useRef<UnitBlockVo | null>(initialContextValue.unitBlock);
  const [zoomedArea, setZoomedArea] = useState<AreaVo | null>(zoomedAreaSource.current);
  const [targetArea, setTargetArea] = useState<AreaVo | null>(targetAreaSource.current);
  const [unitBlock, setUnitBlock] = useState<UnitBlockVo | null>(unitBlockSource.current);
  const [zoomedAreaOffset, setZoomedAreaOffset] = useState<OffsetVo>(
    createOffsetOfTwoAreas(zoomedAreaSource.current, targetAreaSource.current)
  );

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

  const joinGame = useCallback(() => {
    setStatus('CONNECTING');
    const newGameSocketConn = GameSocketConn.newGameSocketConn({
      onAreaZoomed: (newArea: AreaVo, newUnitBlock: UnitBlockVo) => {
        if (!zoomedAreaSource.current || !zoomedAreaSource.current.isEqual(newArea)) {
          zoomedAreaSource.current = newArea;
        }
        unitBlockSource.current = newUnitBlock;
        updateUnitBlockAndOffsetsDebouncer.cancel();
        updateUnitBlockAndOffsetsDebouncer();
      },
      onZoomedAreaUpdated: (newArea: AreaVo, newUnitBlock: UnitBlockVo) => {
        if (!zoomedAreaSource.current || !zoomedAreaSource.current.isEqual(newArea)) {
          zoomedAreaSource.current = newArea;
        }

        unitBlockSource.current = newUnitBlock;
        updateUnitBlockAndOffsetsDebouncer();
      },
      onInformationUpdated: (newDimension: DimensionVo) => {
        setDimension(newDimension);
      },
      onOpen: () => {
        setStatus('CONNECTED');
      },
      onClose: () => {
        setStatus('CLOSED');
        setGameSocketConn(null);
        setDimension(initialContextValue.dimension);
        setTargetArea(initialContextValue.targetArea);

        zoomedAreaSource.current = initialContextValue.zoomedArea;
        targetAreaSource.current = initialContextValue.targetArea;
        unitBlockSource.current = initialContextValue.unitBlock;
        updateUnitBlockAndOffsetsDebouncer();
      },
    });
    setGameSocketConn(newGameSocketConn);
  }, []);

  const leaveGame = useCallback(() => {
    setStatus('CLOSING');
    gameSocketConn?.disconnect();
  }, [gameSocketConn]);

  const buildItem = useCallback(
    (coordinate: CoordinateVo, itemId: string) => {
      gameSocketConn?.buildItem(coordinate, itemId);
    },
    [gameSocketConn]
  );

  const sendZoomAreaAction = useCallback(
    (newArea: AreaVo) => {
      gameSocketConn?.zoomArea(newArea);
    },
    [gameSocketConn]
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
          items,
          selectedItem,
          selectItem,
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
          items,
          selectedItem,
          selectItem,
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
