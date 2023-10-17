import { createContext, useCallback, useState, useMemo } from 'react';
import { WorldApiService } from '@/apis/services/world-api-service';
import { WorldModel } from '@/models/world/world/world-model';

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
  children: JSX.Element;
};

function Provider({ children }: Props) {
  const [worldApiService] = useState<WorldApiService>(() => WorldApiService.new());
  const initialContextValue = createInitialContextValue();
  const [myWorlds, setMyWorlds] = useState<WorldModel[] | null>(initialContextValue.myWorlds);

  const getMyWorlds = useCallback(async () => {
    const newMyWorlds = await worldApiService.getMyWorlds();
    setMyWorlds(newMyWorlds);
  }, [worldApiService]);

  const [isCreatingWorld, setIsCreatingWorld] = useState(false);
  const createWorld = useCallback(
    async (name: string) => {
      setIsCreatingWorld(true);
      try {
        const newWorld = await worldApiService.createWorld(name);
        setMyWorlds((_myWorlds) => [newWorld, ...(_myWorlds || [])]);
      } catch (e) {
        console.error(e);
      } finally {
        setIsCreatingWorld(false);
      }
    },
    [worldApiService]
  );

  const [deleteWorldStatusMap, setDeleteWorldStatusMap] = useState<StatusMap>({});
  const deleteWorld = useCallback(
    async (worldId: string) => {
      setDeleteWorldStatusMap((prev) => {
        prev[worldId] = true;
        return prev;
      });
      try {
        await worldApiService.deleteWorld(worldId);
        setMyWorlds((prev) => {
          if (!prev) return null;
          return prev.filter((world) => world.getId() !== worldId);
        });
      } catch (e) {
        console.error(e);
      } finally {
        setDeleteWorldStatusMap((prev) => {
          delete prev[worldId];
          return prev;
        });
      }
    },
    [worldApiService]
  );

  return (
    <Context.Provider
      value={useMemo<ContextValue>(
        () => ({
          myWorlds,
          getMyWorlds,
          isCreatingWorld,
          createWorld,
          deleteWorldStatusMap,
          deleteWorld,
        }),
        [myWorlds, getMyWorlds, isCreatingWorld, createWorld, deleteWorldStatusMap, deleteWorld]
      )}
    >
      {children}
    </Context.Provider>
  );
}

export { Provider as MyWorldsProvider, Context as MyWorldsContext };
