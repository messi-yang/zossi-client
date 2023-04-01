import { createContext, useCallback, useState, useMemo, useEffect } from 'react';
import ItemApi from '@/apis/ItemApi';
import {} from '@/models/valueObjects';
import { ItemAgg } from '@/models/aggregates';

type ContextValue = {
  items: ItemAgg[] | null;
};

function createInitialContextValue(): ContextValue {
  return {
    items: null,
  };
}

const Context = createContext<ContextValue>(createInitialContextValue());

type Props = {
  children: JSX.Element;
};

export function Provider({ children }: Props) {
  const [itemApi] = useState<ItemApi>(() => ItemApi.new());
  const initialContextValue = createInitialContextValue();
  const [items, setItems] = useState<ItemAgg[] | null>(initialContextValue.items);

  const getItems = useCallback(async () => {
    const newItems = await itemApi.getItems();
    setItems(newItems);
  }, []);

  useEffect(() => {
    getItems();
  }, []);

  return (
    <Context.Provider
      value={useMemo<ContextValue>(
        () => ({
          items,
        }),
        [items]
      )}
    >
      {children}
    </Context.Provider>
  );
}

export default Context;
