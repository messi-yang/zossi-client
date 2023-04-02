import { createContext, useCallback, useState, useMemo, useEffect } from 'react';
import WorldApi from '@/apis/WorldApi';
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

export function Provider({ children }: Props) {
  const [worldApi] = useState<WorldApi>(() => WorldApi.new());
  const initialContextValue = createInitialContextValue();
  const [worlds, setWorlds] = useState<WorldAgg[] | null>(initialContextValue.worlds);

  const getWorlds = useCallback(async () => {
    const newWorlds = await worldApi.getWorlds();
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

export default Context;
