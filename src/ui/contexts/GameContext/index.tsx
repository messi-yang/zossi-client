import { createContext, useCallback, useState, useMemo } from 'react';
import debounce from 'lodash/debounce';
import { GameSocketConn } from '@/apis/socketConnections';
import { MapRangeVo, GameMapVo, LocationVo, MapSizeVo } from '@/models/valueObjects';
import { ItemAgg } from '@/models/aggregates';

type Status = 'CLOSED' | 'CLOSING' | 'CONNECTING' | 'OPEN';

type ContextValue = {
  status: Status;
  mapSize: MapSizeVo | null;
  zoomedMapRange: MapRangeVo | null;
  gameMap: GameMapVo | null;
  items: ItemAgg[] | null;
  joinGame: () => void;
  buildItem: (location: LocationVo, itemId: string) => void;
  destroyItem: (location: LocationVo) => void;
  zoomMapRange: (mapRange: MapRangeVo) => void;
  leaveGame: () => void;
};

function createInitialContextValue(): ContextValue {
  return {
    status: 'CLOSED',
    mapSize: null,
    zoomedMapRange: null,
    gameMap: null,
    items: null,
    joinGame: () => {},
    buildItem: () => {},
    destroyItem: () => {},
    zoomMapRange: () => {},
    leaveGame: () => {},
  };
}

const Context = createContext<ContextValue>(createInitialContextValue());

type Props = {
  children: JSX.Element;
};

export function Provider({ children }: Props) {
  const [gameSocketConn, setGameSocketConn] = useState<GameSocketConn | null>(null);
  const [status, setStatus] = useState<Status>('CLOSED');

  const initialContextValue = createInitialContextValue();
  const [mapSize, setMapSize] = useState<MapSizeVo | null>(initialContextValue.mapSize);
  const [items, setItems] = useState<ItemAgg[] | null>(initialContextValue.items);
  const [zoomedMapRange, setZoomedMapRange] = useState<MapRangeVo | null>(initialContextValue.zoomedMapRange);
  const [gameMap, setGameMap] = useState<GameMapVo | null>(initialContextValue.gameMap);

  const joinGame = useCallback(() => {
    const hasUncleanedConnection = !!gameSocketConn;
    if (hasUncleanedConnection) {
      return;
    }

    setStatus('CONNECTING');

    const newGameSocketConn = GameSocketConn.newGameSocketConn({
      onMapRangeZoomed: (newMapRange: MapRangeVo, newGameMap: GameMapVo) => {
        setZoomedMapRange(newMapRange);
        setGameMap(newGameMap);
      },
      onZoomedMapRangeUpdated: (newMapRange: MapRangeVo, newGameMap: GameMapVo) => {
        setZoomedMapRange(newMapRange);
        setGameMap(newGameMap);
      },
      onInformationUpdated: (newMapSize: MapSizeVo) => {
        setMapSize(newMapSize);
      },
      onItemsUpdated: (returnedItems: ItemAgg[]) => {
        setItems(returnedItems);
      },
      onOpen: () => {
        setStatus('OPEN');
      },
      onClose: () => {
        setStatus('CLOSED');
        setGameSocketConn(null);
        setMapSize(initialContextValue.mapSize);
        setItems(null);

        setZoomedMapRange(null);
        setGameMap(null);
      },
    });
    setGameSocketConn(newGameSocketConn);
  }, [gameSocketConn]);

  const leaveGame = useCallback(() => {
    setStatus('CLOSING');
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

  const zoomMapRange = useCallback(
    debounce(
      (newMapRange: MapRangeVo) => {
        gameSocketConn?.zoomMapRange(newMapRange);
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
          mapSize,
          zoomedMapRange,
          gameMap,
          items,
          joinGame,
          leaveGame,
          buildItem,
          destroyItem,
          zoomMapRange,
        }),
        [status, mapSize, zoomedMapRange, gameMap, items, joinGame, leaveGame, buildItem, zoomMapRange]
      )}
    >
      {children}
    </Context.Provider>
  );
}

export default Context;
