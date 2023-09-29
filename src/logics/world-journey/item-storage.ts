import { ItemModel } from '@/models/world/item-model';

type ItemIdsAddedHandler = (itemIds: string[]) => void;
type ItemAddedHandler = (item: ItemModel) => void;

export class ItemStorage {
  private itemIds: string[];

  private itemMap: Record<string, ItemModel | undefined>;

  private itemIdsAddedHandlers: ItemIdsAddedHandler[] = [];

  private itemAddedHandlers: ItemAddedHandler[] = [];

  constructor(itemIds: string[]) {
    this.itemIds = itemIds;
    this.itemMap = {};
  }

  static new(itemIds: string[]) {
    return new ItemStorage(itemIds);
  }

  public getItemIds(): string[] {
    return this.itemIds;
  }

  public addItemId(itemId: string) {
    if (this.itemIds.indexOf(itemId) > -1) {
      return;
    }

    this.itemIds.push(itemId);
    this.publishItemIdsAdded([itemId]);
  }

  public getItem(itemId: string): ItemModel | null {
    return this.itemMap[itemId] || null;
  }

  public addItem(item: ItemModel) {
    const existingItem = this.itemMap[item.getId()];
    if (existingItem) return;

    this.itemMap[item.getId()] = item;
    this.publishItemAdded(item);
  }

  public subscribeItemIdsAdded(handler: ItemIdsAddedHandler): () => void {
    handler(this.getItemIds());

    this.itemIdsAddedHandlers.push(handler);

    return () => {
      this.itemIdsAddedHandlers = this.itemIdsAddedHandlers.filter((hdl) => hdl !== handler);
    };
  }

  private publishItemIdsAdded(itemIds: string[]) {
    this.itemIdsAddedHandlers.forEach((hdl) => {
      hdl(itemIds);
    });
  }

  public subscribeItemAdded(handler: ItemAddedHandler): () => void {
    Object.values(this.itemMap).forEach((item) => {
      if (item) {
        handler(item);
      }
    });

    this.itemAddedHandlers.push(handler);

    return () => {
      this.itemAddedHandlers = this.itemAddedHandlers.filter((hdl) => hdl !== handler);
    };
  }

  private publishItemAdded(item: ItemModel) {
    this.itemAddedHandlers.forEach((hdl) => {
      hdl(item);
    });
  }
}
