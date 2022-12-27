import { createContext, useCallback, useState, useMemo, useRef, useEffect } from 'react';
import debounce from 'lodash/debounce';
import { ItemHttpApi } from '@/apis/httpApis';
import { GameSocketConn } from '@/apis/socketConnections';
import { AreaVo, UnitBlockVo, CoordinateVo, DimensionVo } from '@/models/valueObjects';
import { ItemAgg } from '@/models/aggregates';

type Status = 'CLOSED' | 'CLOSING' | 'CONNECTING' | 'OPEN';

type ContextValue = {
  status: Status;
  dimension: DimensionVo | null;
  zoomedArea: AreaVo | null;
  unitBlock: UnitBlockVo | null;
  items: ItemAgg[] | null;
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
    unitBlock: null,
    items: null,
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
  const fetchItems = useCallback(async () => {
    const returnedItems = await itemHttpApi.fetchItems();
    setItems(returnedItems);
  }, []);
  const fetchItemsOnInitializationEffect = useCallback(() => {
    fetchItems();
  }, [fetchItems]);
  useEffect(fetchItemsOnInitializationEffect, [fetchItemsOnInitializationEffect]);

  const zoomedAreaSource = useRef<AreaVo | null>(initialContextValue.zoomedArea);
  const unitBlockSource = useRef<UnitBlockVo | null>(initialContextValue.unitBlock);
  const [zoomedArea, setZoomedArea] = useState<AreaVo | null>(zoomedAreaSource.current);
  const [unitBlock, setUnitBlock] = useState<UnitBlockVo | null>(unitBlockSource.current);

  const joinGame = useCallback(() => {
    const hasUncleanedConnection = !!gameSocketConn;
    if (hasUncleanedConnection) {
      return;
    }

    setStatus('CONNECTING');

    const newGameSocketConn = GameSocketConn.newGameSocketConn({
      onAreaZoomed: (newArea: AreaVo, newUnitBlock: UnitBlockVo) => {
        setZoomedArea(newArea);
        setUnitBlock(newUnitBlock);
      },
      onZoomedAreaUpdated: (newArea: AreaVo, newUnitBlock: UnitBlockVo) => {
        setZoomedArea(newArea);
        setUnitBlock(newUnitBlock);
      },
      onInformationUpdated: (newDimension: DimensionVo) => {
        setDimension(newDimension);
      },
      onOpen: () => {
        setStatus('OPEN');
      },
      onClose: () => {
        setStatus('CLOSED');
        setGameSocketConn(null);
        setDimension(initialContextValue.dimension);

        setZoomedArea(null);
        setUnitBlock(null);
      },
    });
    setGameSocketConn(newGameSocketConn);
  }, [gameSocketConn]);

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

  const zoomArea = useCallback(
    debounce(
      (newArea: AreaVo) => {
        gameSocketConn?.zoomArea(newArea);
      },
      150,
      { leading: true, maxWait: 500, trailing: true }
    ),
    [gameSocketConn]
  );

  return (
    <Context.Provider
      value={useMemo<ContextValue>(
        () => ({
          status,
          dimension,
          zoomedArea,
          unitBlock,
          items,
          joinGame,
          leaveGame,
          buildItem,
          zoomArea,
        }),
        [status, dimension, zoomedArea, unitBlock, items, joinGame, leaveGame, buildItem, zoomArea]
      )}
    >
      {children}
    </Context.Provider>
  );
}

export default Context;
