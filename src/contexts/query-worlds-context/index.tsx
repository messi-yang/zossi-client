import { createContext, useCallback, useState, useMemo } from 'react';
import { WorldApiService } from '@/api-services/world-api-service';
import { WorldModel } from '@/models';

type ContextValue = {
  worlds: WorldModel[] | null;
  queryWorlds: () => Promise<void>;
};

function createInitialContextValue(): ContextValue {
  return {
    worlds: null,
    queryWorlds: async () => {},
  };
}

const Context = createContext<ContextValue>(createInitialContextValue());

type Props = {
  children: JSX.Element;
};

function Provider({ children }: Props) {
  const [worldApiService] = useState<WorldApiService>(() => WorldApiService.new());
  const initialContextValue = createInitialContextValue();
  const [worlds, setWorlds] = useState<WorldModel[] | null>(initialContextValue.worlds);

  const queryWorlds = useCallback(async () => {
    const newWorlds = await worldApiService.queryWorlds(10, 0);
    setWorlds(newWorlds);
  }, []);

  return (
    <Context.Provider
      value={useMemo<ContextValue>(
        () => ({
          worlds,
          queryWorlds,
        }),
        [worlds, queryWorlds]
      )}
    >
      {children}
    </Context.Provider>
  );
}

export { Provider as QueryWorldsProvider, Context as QueryWorldsContext };
