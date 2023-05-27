import { createContext, useCallback, useState, useMemo } from 'react';
import { ItemApiService } from '@/api-services/item-api-service';
import { ItemModel } from '@/models';

type ContextValue = {
  items: ItemModel[] | null;
  fetchItems: () => Promise<void>;
};

function createInitialContextValue(): ContextValue {
  return {
    items: null,
    fetchItems: async () => {},
  };
}

const Context = createContext<ContextValue>(createInitialContextValue());

type Props = {
  children: JSX.Element;
};

function Provider({ children }: Props) {
  const [itemApiService] = useState<ItemApiService>(() => ItemApiService.new());
  const initialContextValue = createInitialContextValue();
  const [items, setItems] = useState<ItemModel[] | null>(initialContextValue.items);

  const fetchItems = useCallback(async () => {
    const newItems = await itemApiService.getItems();
    setItems(newItems);
  }, []);

  return (
    <Context.Provider
      value={useMemo<ContextValue>(
        () => ({
          items,
          fetchItems,
        }),
        [items, fetchItems]
      )}
    >
      {children}
    </Context.Provider>
  );
}

export { Provider as ItemProvider, Context as ItemContext };
