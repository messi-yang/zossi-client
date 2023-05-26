import { createContext, useCallback, useState, useMemo } from 'react';
import { WorldService } from '@/apis/services/world-service';
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
  const [worldService] = useState<WorldService>(() => WorldService.new());
  const initialContextValue = createInitialContextValue();
  const [worlds, setWorlds] = useState<WorldModel[] | null>(initialContextValue.worlds);

  const queryWorlds = useCallback(async () => {
    const newWorlds = await worldService.queryWorlds(10, 0);
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

export { Provider as SearchWorldProvider, Context as SearchWorldContext };
