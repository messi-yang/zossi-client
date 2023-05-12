import { createContext, useCallback, useState, useMemo, useEffect } from 'react';
import { ItemService } from '@/apis/services/item-service';
import { ItemModel } from '@/models';

type ContextValue = {
  items: ItemModel[] | null;
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

function Provider({ children }: Props) {
  const [itemService] = useState<ItemService>(() => ItemService.new());
  const initialContextValue = createInitialContextValue();
  const [items, setItems] = useState<ItemModel[] | null>(initialContextValue.items);

  const getItems = useCallback(async () => {
    const newItems = await itemService.getItems();
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

export { Provider as ItemProvider, Context as ItemContext };
