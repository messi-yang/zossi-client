import { createContext, useCallback, useState, useMemo } from 'react';
import debounce from 'lodash/debounce';
import GameSocket from '@/apis/GameSocket';
import { BoundVo, MapVo, LocationVo, SizeVo, ViewVo, CameraVo } from '@/models/valueObjects';
import { ItemAgg } from '@/models/aggregates';

type GameStatus = 'WAITING' | 'CONNECTING' | 'OPEN' | 'DISCONNECTING' | 'DISCONNECTED';

type ContextValue = {
  gameStatus: GameStatus;
  size: SizeVo | null;
  viewBound: BoundVo | null;
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
    size: null,
    viewBound: null,
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
  const [gameSocket, setGameSocket] = useState<GameSocket | null>(null);
  const [gameStatus, setGameStatus] = useState<GameStatus>('WAITING');

  const initialContextValue = createInitialContextValue();
  const [size, setSize] = useState<SizeVo | null>(initialContextValue.size);
  const [items, setItems] = useState<ItemAgg[] | null>(initialContextValue.items);
  const [viewBound, setViewBound] = useState<BoundVo | null>(initialContextValue.viewBound);
  const [map, setMap] = useState<MapVo | null>(initialContextValue.map);
  const [camera, setCamera] = useState<CameraVo | null>(initialContextValue.camera);

  const reset = useCallback(() => {
    setSize(initialContextValue.size);
    setItems(initialContextValue.items);
    setViewBound(initialContextValue.viewBound);
    setMap(initialContextValue.map);
  }, []);

  const joinGame = useCallback(() => {
    const hasUncleanedConnection = !!gameSocket;
    if (hasUncleanedConnection) {
      return;
    }

    const newGameSocket = GameSocket.newGameSocket({
      onGameJoined: (newSize: SizeVo, newCamera: CameraVo, view: ViewVo) => {
        setSize(newSize);
        setViewBound(view.getBound());
        setMap(view.getmap());
        setCamera(newCamera);
      },
      onCameraChanged: (newCamera: CameraVo, view: ViewVo) => {
        setViewBound(view.getBound());
        setMap(view.getmap());
        setCamera(newCamera);
      },
      onViewUpdated: (view: ViewVo) => {
        setViewBound(view.getBound());
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
          setGameSocket(null);
          reset();
        } else {
          setGameStatus('DISCONNECTED');
          setGameSocket(null);
        }
      },
    });
    setGameStatus('CONNECTING');
    setGameSocket(newGameSocket);
  }, [gameSocket]);

  const leaveGame = useCallback(() => {
    setGameStatus('DISCONNECTING');
    gameSocket?.disconnect();
  }, [gameSocket]);

  const buildItem = useCallback(
    (location: LocationVo, itemId: string) => {
      gameSocket?.buildItem(location, itemId);
    },
    [gameSocket]
  );

  const destroyItem = useCallback(
    (location: LocationVo) => {
      gameSocket?.destroyItem(location);
    },
    [gameSocket]
  );

  const changeCamera = useCallback(
    debounce(
      (newCamera: CameraVo) => {
        gameSocket?.changeCamera(newCamera);
      },
      150,
      { leading: true, maxWait: 500, trailing: true }
    ),
    [gameSocket]
  );

  return (
    <Context.Provider
      value={useMemo<ContextValue>(
        () => ({
          gameStatus,
          size,
          viewBound,
          map,
          items,
          camera,
          joinGame,
          leaveGame,
          buildItem,
          destroyItem,
          changeCamera,
        }),
        [gameStatus, size, viewBound, map, items, camera, joinGame, leaveGame, buildItem, changeCamera]
      )}
    >
      {children}
    </Context.Provider>
  );
}

export default Context;
