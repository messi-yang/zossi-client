import { createContext, useCallback, useState, useMemo } from 'react';
import { WorldApi } from '@/adapters/apis/world-api';
import { WorldModel } from '@/models/world/world/world-model';
import { NotificationEventDispatcher } from '@/event-dispatchers/notification-event-dispatcher';

type StatusMap = {
  [worldId: string]: boolean | undefined;
};

type ContextValue = {
  myWorlds: WorldModel[] | null;
  getMyWorlds: () => Promise<void>;

  isCreatingWorld: boolean;
  createWorld: (name: string) => Promise<void>;

  deleteWorldStatusMap: StatusMap;
  deleteWorld: (worldId: string) => Promise<void>;
};

function createInitialContextValue(): ContextValue {
  return {
    myWorlds: null,
    getMyWorlds: async () => {},

    isCreatingWorld: false,
    createWorld: async () => {},

    deleteWorldStatusMap: {},
    deleteWorld: async () => {},
  };
}

const Context = createContext<ContextValue>(createInitialContextValue());

type Props = {
  children: React.ReactNode;
};

function Provider({ children }: Props) {
  const [worldApi] = useState<WorldApi>(() => WorldApi.create());
  const initialContextValue = createInitialContextValue();
  const [myWorlds, setMyWorlds] = useState<WorldModel[] | null>(initialContextValue.myWorlds);
  const notificationEventDispatcher = useMemo(() => NotificationEventDispatcher.create(), []);

  const getMyWorlds = useCallback(async () => {
    const newMyWorlds = await worldApi.getMyWorlds();
    setMyWorlds(newMyWorlds);
  }, [worldApi]);

  const [isCreatingWorld, setIsCreatingWorld] = useState(false);
  const createWorld = useCallback(
    async (name: string) => {
      setIsCreatingWorld(true);
      try {
        const newWorld = await worldApi.createWorld(name);
        setMyWorlds((_myWorlds) => [newWorld, ...(_myWorlds || [])]);
      } catch (e) {
        console.error(e);
      } finally {
        setIsCreatingWorld(false);
      }
    },
    [worldApi]
  );

  const [deleteWorldStatusMap, setDeleteWorldStatusMap] = useState<StatusMap>({});
  const deleteWorld = useCallback(
    async (worldId: string) => {
      setDeleteWorldStatusMap((prev) => {
        prev[worldId] = true;
        return prev;
      });

      const error = await worldApi.deleteWorld(worldId);
      if (error) {
        notificationEventDispatcher.publishErrorTriggeredEvent(error.message);
      }

      setDeleteWorldStatusMap((prev) => {
        delete prev[worldId];
        return prev;
      });
    },
    [notificationEventDispatcher, worldApi]
  );

  const contextValue = useMemo<ContextValue>(
    () => ({
      myWorlds,
      getMyWorlds,
      isCreatingWorld,
      createWorld,
      deleteWorldStatusMap,
      deleteWorld,
    }),
    [myWorlds, getMyWorlds, isCreatingWorld, createWorld, deleteWorldStatusMap, deleteWorld]
  );

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
}

export { Provider as MyWorldsProvider, Context as MyWorldsContext };
