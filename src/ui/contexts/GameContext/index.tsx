import { createContext, useCallback, useState, useMemo } from 'react';
import debounce from 'lodash/debounce';
import { GameSocketConn } from '@/apis/socketConnections';
import { MapRangeVo, GameMapVo, LocationVo, MapSizeVo } from '@/models/valueObjects';
import { ItemAgg } from '@/models/aggregates';

type GameStatus = 'WAITING' | 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED';

type ContextValue = {
  gameStatus: GameStatus;
  mapSize: MapSizeVo | null;
  observedMapRange: MapRangeVo | null;
  gameMap: GameMapVo | null;
  items: ItemAgg[] | null;
  joinGame: () => void;
  buildItem: (location: LocationVo, itemId: string) => void;
  destroyItem: (location: LocationVo) => void;
  observeMapRange: (mapRange: MapRangeVo) => void;
  leaveGame: () => void;
};

function createInitialContextValue(): ContextValue {
  return {
    gameStatus: 'CLOSED',
    mapSize: null,
    observedMapRange: null,
    gameMap: null,
    items: null,
    joinGame: () => {},
    buildItem: () => {},
    destroyItem: () => {},
    observeMapRange: () => {},
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
  const [observedMapRange, setObservedMapRange] = useState<MapRangeVo | null>(initialContextValue.observedMapRange);
  const [gameMap, setGameMap] = useState<GameMapVo | null>(initialContextValue.gameMap);

  const joinGame = useCallback(() => {
    const hasUncleanedConnection = !!gameSocketConn;
    if (hasUncleanedConnection) {
      return;
    }

    const newGameSocketConn = GameSocketConn.newGameSocketConn({
      onMapRangeObserved: (newMapRange: MapRangeVo, newGameMap: GameMapVo) => {
        setObservedMapRange(newMapRange);
        setGameMap(newGameMap);
      },
      onObservedMapRangeUpdated: (newMapRange: MapRangeVo, newGameMap: GameMapVo) => {
        setObservedMapRange(newMapRange);
        setGameMap(newGameMap);
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
      onClose: () => {
        setGameStatus('WAITING');
        setGameSocketConn(null);
        setMapSize(initialContextValue.mapSize);
        setItems(null);

        setObservedMapRange(null);
        setGameMap(null);
      },
    });
    setGameStatus('CONNECTING');
    setGameSocketConn(newGameSocketConn);
  }, [gameSocketConn]);

  const leaveGame = useCallback(() => {
    setGameStatus('CLOSING');
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

  const observeMapRange = useCallback(
    debounce(
      (newMapRange: MapRangeVo) => {
        gameSocketConn?.observeMapRange(newMapRange);
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
          observedMapRange,
          gameMap,
          items,
          joinGame,
          leaveGame,
          buildItem,
          destroyItem,
          observeMapRange,
        }),
        [gameStatus, mapSize, observedMapRange, gameMap, items, joinGame, leaveGame, buildItem, observeMapRange]
      )}
    >
      {children}
    </Context.Provider>
  );
}

export default Context;
