import { createContext, useCallback, useState, useMemo } from 'react';
import debounce from 'lodash/debounce';
import { GameSocketConn } from '@/apis/socketConnections';
import { RangeVo, MapVo, LocationVo, DimensionVo, ViewVo, CameraVo } from '@/models/valueObjects';
import { ItemAgg } from '@/models/aggregates';

type GameStatus = 'WAITING' | 'CONNECTING' | 'OPEN' | 'DISCONNECTING' | 'DISCONNECTED';

type ContextValue = {
  gameStatus: GameStatus;
  dimension: DimensionVo | null;
  viewRange: RangeVo | null;
  map: MapVo | null;
  items: ItemAgg[] | null;
  camera: CameraVo | null;
  joinGame: () => void;
  buildItem: (location: LocationVo, itemId: string) => void;
  destroyItem: (location: LocationVo) => void;
  changeCamera: (camera: CameraVo) => void;
  leaveGame: () => void;
};

function createInitialContextValue(): ContextValue {
  return {
    gameStatus: 'DISCONNECTED',
    dimension: null,
    viewRange: null,
    map: null,
    items: null,
    camera: null,
    joinGame: () => {},
    buildItem: () => {},
    destroyItem: () => {},
    changeCamera: () => {},
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
  const [dimension, setDimension] = useState<DimensionVo | null>(initialContextValue.dimension);
  const [items, setItems] = useState<ItemAgg[] | null>(initialContextValue.items);
  const [viewRange, setViewRange] = useState<RangeVo | null>(initialContextValue.viewRange);
  const [map, setMap] = useState<MapVo | null>(initialContextValue.map);
  const [camera, setCamera] = useState<CameraVo | null>(initialContextValue.camera);

  const reset = useCallback(() => {
    setDimension(initialContextValue.dimension);
    setItems(initialContextValue.items);
    setViewRange(initialContextValue.viewRange);
    setMap(initialContextValue.map);
  }, []);

  const joinGame = useCallback(() => {
    const hasUncleanedConnection = !!gameSocketConn;
    if (hasUncleanedConnection) {
      return;
    }

    const newGameSocketConn = GameSocketConn.newGameSocketConn({
      onGameJoined: (newDimension: DimensionVo, newCamera: CameraVo, view: ViewVo) => {
        setDimension(newDimension);
        setViewRange(view.getRange());
        setMap(view.getmap());
        setCamera(newCamera);
      },
      onCameraChanged: (newCamera: CameraVo, view: ViewVo) => {
        setViewRange(view.getRange());
        setMap(view.getmap());
        setCamera(newCamera);
      },
      onViewUpdated: (view: ViewVo) => {
        setViewRange(view.getRange());
        setMap(view.getmap());
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

  const changeCamera = useCallback(
    debounce(
      (newCamera: CameraVo) => {
        gameSocketConn?.changeCamera(newCamera);
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
          dimension,
          viewRange,
          map,
          items,
          camera,
          joinGame,
          leaveGame,
          buildItem,
          destroyItem,
          changeCamera,
        }),
        [gameStatus, dimension, viewRange, map, items, camera, joinGame, leaveGame, buildItem, changeCamera]
      )}
    >
      {children}
    </Context.Provider>
  );
}

export default Context;
