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
  myPlayer: PlayerEntity | null;
  otherPlayers: PlayerEntity[] | null;
  allPlayers: PlayerEntity[] | null;
  view: ViewVo | null;
  items: ItemAgg[] | null;
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
    myPlayer: null,
    otherPlayers: null,
    allPlayers: null,
    view: null,
    items: null,
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
  const [myPlayer, setMyPlayer] = useState<PlayerEntity | null>(initialContextValue.myPlayer);
  const [otherPlayers, setOtherPlayers] = useState<PlayerEntity[] | null>(initialContextValue.otherPlayers);
  const allPlayers = useMemo(() => {
    if (!myPlayer || !otherPlayers) {
      return null;
    }
    return [myPlayer, ...otherPlayers];
  }, [myPlayer, otherPlayers]);
  const [items, setItems] = useState<ItemAgg[] | null>(initialContextValue.items);
  const [view, setView] = useState<ViewVo | null>(initialContextValue.view);

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
      onGameJoined: (
        newMyPlayer: PlayerEntity,
        newOtherPlayers: PlayerEntity[],
        newMapSize: SizeVo,
        newView: ViewVo
      ) => {
        setMyPlayer(newMyPlayer);
        setOtherPlayers(newOtherPlayers);
        setMapSize(newMapSize);
        setView(newView);
      },
      onPlayersUpdated: (newMyPlayer: PlayerEntity, newOtherPlayers: PlayerEntity[]) => {
        setMyPlayer(newMyPlayer);
        setOtherPlayers(newOtherPlayers);
      },
      onViewUpdated: (newView: ViewVo) => {
        setView(newView);
      },
      onItemsUpdated: (newItems: ItemAgg[]) => {
        setItems(newItems);
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
          myPlayer,
          otherPlayers,
          allPlayers,
          view,
          items,
          joinGame,
          leaveGame,
          buildItem,
          destroyItem,
          changeCamera,
        }),
        [
          gameStatus,
          mapSize,
          myPlayer,
          otherPlayers,
          allPlayers,
          view,
          items,
          joinGame,
          leaveGame,
          buildItem,
          changeCamera,
        ]
      )}
    >
      {children}
    </Context.Provider>
  );
}

export default Context;
