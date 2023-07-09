import { createContext, useCallback, useState, useMemo } from 'react';
import { WorldApiService } from '@/api-services/world-api-service';
import { WorldModel } from '@/models';

type ContextValue = {
  myWorlds: WorldModel[] | null;
  getMyWorlds: () => Promise<void>;

  isCreatingWorld: boolean;
  createWorld: (name: string) => Promise<void>;
};

function createInitialContextValue(): ContextValue {
  return {
    myWorlds: null,
    getMyWorlds: async () => {},

    isCreatingWorld: false,
    createWorld: async () => {},
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
  }, []);

  const [isCreatingWorld, setIsCreatingWorld] = useState(false);
  const createWorld = useCallback(async (name: string) => {
    setIsCreatingWorld(true);
    const newWorld = await worldApiService.createWorld(name);
    setMyWorlds((_myWorlds) => [newWorld, ...(_myWorlds || [])]);
    setIsCreatingWorld(false);
  }, []);

  return (
    <Context.Provider
      value={useMemo<ContextValue>(
        () => ({
          myWorlds,
          getMyWorlds,
          isCreatingWorld,
          createWorld,
        }),
        [myWorlds, getMyWorlds, isCreatingWorld, createWorld]
      )}
    >
      {children}
    </Context.Provider>
  );
}

export { Provider as MyWorldsProvider, Context as MyWorldsContext };
