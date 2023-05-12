import { createContext, useCallback, useState, useMemo, useEffect } from 'react';
import { WorldService } from '@/apis/services/world-service';
import {} from '@/models/valueObjects';
import { WorldAgg } from '@/models/aggregates';

type ContextValue = {
  worlds: WorldAgg[] | null;
};

function createInitialContextValue(): ContextValue {
  return {
    worlds: null,
  };
}

const Context = createContext<ContextValue>(createInitialContextValue());

type Props = {
  children: JSX.Element;
};

function Provider({ children }: Props) {
  const [worldService] = useState<WorldService>(() => WorldService.new());
  const initialContextValue = createInitialContextValue();
  const [worlds, setWorlds] = useState<WorldAgg[] | null>(initialContextValue.worlds);

  const getWorlds = useCallback(async () => {
    const newWorlds = await worldService.getWorlds();
    setWorlds(newWorlds);
  }, []);

  useEffect(() => {
    getWorlds();
  }, []);

  return (
    <Context.Provider
      value={useMemo<ContextValue>(
        () => ({
          worlds,
        }),
        [worlds]
      )}
    >
      {children}
    </Context.Provider>
  );
}

export { Provider as WorldProvider, Context as WorldContext };