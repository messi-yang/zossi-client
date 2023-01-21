import { createContext, useCallback, useState, useMemo } from 'react';
import debounce from 'lodash/debounce';
import GameSocket from '@/apis/GameSocket';
import { LocationVo, SizeVo, ViewVo, CameraVo } from '@/models/valueObjects';
import { ItemAgg } from '@/models/aggregates';
import { PlayerEntity } from '@/models/entities';

type GameStatus = 'WAITING' | 'CONNECTING' | 'OPEN' | 'DISCONNECTING' | 'DISCONNECTED';

type ContextValue = {
  gameStatus: GameStatus;
  mapSize: SizeVo | null;
  player: PlayerEntity | null;
  view: ViewVo | null;
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
    mapSize: null,
    player: null,
    view: null,
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
  const [mapSize, setMapSize] = useState<SizeVo | null>(initialContextValue.mapSize);
  const [player, setPlayer] = useState<PlayerEntity | null>(initialContextValue.player);
  const [items, setItems] = useState<ItemAgg[] | null>(initialContextValue.items);
  const [view, setView] = useState<ViewVo | null>(initialContextValue.view);
  const [camera, setCamera] = useState<CameraVo | null>(initialContextValue.camera);

  const reset = useCallback(() => {
    setMapSize(initialContextValue.mapSize);
    setItems(initialContextValue.items);
  }, []);

  const joinGame = useCallback(() => {
    const hasUncleanedConnection = !!gameSocket;
    if (hasUncleanedConnection) {
      return;
    }

    const newGameSocket = GameSocket.newGameSocket({
      onGameJoined: (newMapSize: SizeVo, newCamera: CameraVo, newView: ViewVo) => {
        setMapSize(newMapSize);
        setView(newView);
        setCamera(newCamera);
      },
      onPlayerUpdated: (newPlayer: PlayerEntity) => {
        setPlayer(newPlayer);
      },
      onCameraChanged: (newCamera: CameraVo) => {
        setCamera(newCamera);
      },
      onViewChanged: (newView: ViewVo) => {
        setView(newView);
      },
      onViewUpdated: (newView: ViewVo) => {
        setView(newView);
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
          mapSize,
          player,
          view,
          items,
          camera,
          joinGame,
          leaveGame,
          buildItem,
          destroyItem,
          changeCamera,
        }),
        [gameStatus, mapSize, player, view, items, camera, joinGame, leaveGame, buildItem, changeCamera]
      )}
    >
      {children}
    </Context.Provider>
  );
}

export default Context;
