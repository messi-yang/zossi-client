import { createContext, useCallback, useState, useMemo } from 'react';
import debounce from 'lodash/debounce';
import { GameSocketConn } from '@/apis/socketConnections';
import { ExtentVo, UnitMapVo, LocationVo, MapSizeVo } from '@/models/valueObjects';
import { ItemAgg } from '@/models/aggregates';

type GameStatus = 'WAITING' | 'CONNECTING' | 'OPEN' | 'DISCONNECTING' | 'DISCONNECTED';

type ContextValue = {
  gameStatus: GameStatus;
  mapSize: MapSizeVo | null;
  observedExtent: ExtentVo | null;
  unitMap: UnitMapVo | null;
  items: ItemAgg[] | null;
  joinGame: () => void;
  buildItem: (location: LocationVo, itemId: string) => void;
  destroyItem: (location: LocationVo) => void;
  observeExtent: (extent: ExtentVo) => void;
  leaveGame: () => void;
};

function createInitialContextValue(): ContextValue {
  return {
    gameStatus: 'DISCONNECTED',
    mapSize: null,
    observedExtent: null,
    unitMap: null,
    items: null,
    joinGame: () => {},
    buildItem: () => {},
    destroyItem: () => {},
    observeExtent: () => {},
    leaveGame: () => {},
  };
}

const Context = createContext<ContextValue>(createInitialContextValue());

type Props = {
  children: JSX.Element;
};

export function Provider({ children }: Props) {
  const [gameSocketConn, setGameSocketConn] = useState<GameSocketConn | null>(null);
  const [gameStatus, setGameStatus] = useState<GameStatus>('WAITING');

  const initialContextValue = createInitialContextValue();
  const [mapSize, setMapSize] = useState<MapSizeVo | null>(initialContextValue.mapSize);
  const [items, setItems] = useState<ItemAgg[] | null>(initialContextValue.items);
  const [observedExtent, setObservedExtent] = useState<ExtentVo | null>(initialContextValue.observedExtent);
  const [unitMap, setUnitMap] = useState<UnitMapVo | null>(initialContextValue.unitMap);

  const reset = useCallback(() => {
    setMapSize(initialContextValue.mapSize);
    setItems(initialContextValue.items);
    setObservedExtent(initialContextValue.observedExtent);
    setUnitMap(initialContextValue.unitMap);
  }, []);

  const joinGame = useCallback(() => {
    const hasUncleanedConnection = !!gameSocketConn;
    if (hasUncleanedConnection) {
      return;
    }

    const newGameSocketConn = GameSocketConn.newGameSocketConn({
      onExtentObserved: (newExtent: ExtentVo, newUnitMap: UnitMapVo) => {
        setObservedExtent(newExtent);
        setUnitMap(newUnitMap);
      },
      onObservedExtentUpdated: (newExtent: ExtentVo, newUnitMap: UnitMapVo) => {
        setObservedExtent(newExtent);
        setUnitMap(newUnitMap);
      },
      onInformationUpdated: (newMapSize: MapSizeVo) => {
        setMapSize(newMapSize);
      },
      onItemsUpdated: (returnedItems: ItemAgg[]) => {
        setItems(returnedItems);
      },
      onOpen: () => {
        setGameStatus('OPEN');
      },
      onClose: (disconnectedByClient: boolean) => {
        if (disconnectedByClient) {
          setGameStatus('WAITING');
          setGameSocketConn(null);
          reset();
        } else {
          setGameStatus('DISCONNECTED');
          setGameSocketConn(null);
        }
      },
    });
    setGameStatus('CONNECTING');
    setGameSocketConn(newGameSocketConn);
  }, [gameSocketConn]);

  const leaveGame = useCallback(() => {
    setGameStatus('DISCONNECTING');
    gameSocketConn?.disconnect();
  }, [gameSocketConn]);

  const buildItem = useCallback(
    (location: LocationVo, itemId: string) => {
      gameSocketConn?.buildItem(location, itemId);
    },
    [gameSocketConn]
  );

  const destroyItem = useCallback(
    (location: LocationVo) => {
      gameSocketConn?.destroyItem(location);
    },
    [gameSocketConn]
  );

  const observeExtent = useCallback(
    debounce(
      (newExtent: ExtentVo) => {
        gameSocketConn?.observeExtent(newExtent);
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
          gameStatus,
          mapSize,
          observedExtent,
          unitMap,
          items,
          joinGame,
          leaveGame,
          buildItem,
          destroyItem,
          observeExtent,
        }),
        [gameStatus, mapSize, observedExtent, unitMap, items, joinGame, leaveGame, buildItem, observeExtent]
      )}
    >
      {children}
    </Context.Provider>
  );
}

export default Context;
