import { createContext, useCallback, useState, useMemo } from 'react';
import { ItemService } from '@/apis/services/item-service';
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
  const [itemService] = useState<ItemService>(() => ItemService.new());
  const initialContextValue = createInitialContextValue();
  const [items, setItems] = useState<ItemModel[] | null>(initialContextValue.items);

  const fetchItems = useCallback(async () => {
    const newItems = await itemService.getItems();
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
