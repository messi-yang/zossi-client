import { createContext, useCallback, useState, useMemo } from 'react';
import { WorldService } from '@/apis/services/world-service';
import { WorldModel } from '@/models';

type ContextValue = {
  worlds: WorldModel[] | null;
  fetchWorlds: () => Promise<void>;
};

function createInitialContextValue(): ContextValue {
  return {
    worlds: null,
    fetchWorlds: async () => {},
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

  const fetchWorlds = useCallback(async () => {
    const newWorlds = await worldService.getWorlds();
    setWorlds(newWorlds);
  }, []);

  return (
    <Context.Provider
      value={useMemo<ContextValue>(
        () => ({
          worlds,
          fetchWorlds,
        }),
        [worlds, fetchWorlds]
      )}
    >
      {children}
    </Context.Provider>
  );
}

export { Provider as WorldProvider, Context as WorldContext };
