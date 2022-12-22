import { createContext, useEffect, useMemo, useState, useCallback } from 'react';
import { ItemApi } from '@/apis';
import { ItemAgg } from '@/models/aggregates';

type ItemContextValue = {
  items: ItemAgg[] | null;
};

function createInitialItemContextValue(): ItemContextValue {
  return { items: null };
}

const ItemContext = createContext<ItemContextValue>(createInitialItemContextValue());

type Props = {
  children: JSX.Element;
};

export function Provider({ children }: Props) {
  const itemApi = ItemApi.newItemApi();

  const [items, setItems] = useState<ItemAgg[] | null>(null);

  const fetchItems = useCallback(async () => {
    const returnedItems = await itemApi.fetchItems();
    setItems(returnedItems);
  }, []);

  const fetchItemsOnInitializationEffect = useCallback(() => {
    fetchItems();
  }, [fetchItems]);
  useEffect(fetchItemsOnInitializationEffect, [fetchItemsOnInitializationEffect]);

  const itemContextValue = useMemo<ItemContextValue>(() => ({ items }), [items]);

  return <ItemContext.Provider value={itemContextValue}>{children}</ItemContext.Provider>;
}

export default ItemContext;
