import { ItemModel } from '@/models/world/item/item-model';

export type PlaceholderItemIdsAddedHandler = (placeholderItemIds: string[]) => void;

export type ItemAddedHandler = (item: ItemModel) => void;

export class ItemManager {
  /**
   * Placeholder item ids that stores the references to the coming items.
   * Once the items are added to the storage, the corresponding placeholder item ids will be erased.
   */
  private placeholderItemIds: string[];

  private itemMap: Record<string, ItemModel | undefined>;

  private placeholderItemIdsAddedHandlers: PlaceholderItemIdsAddedHandler[] = [];

  private itemAddedHandlers: ItemAddedHandler[] = [];

  constructor(placeholderItemIds: string[]) {
    this.placeholderItemIds = placeholderItemIds;
    this.itemMap = {};
  }

  static new(placeholderItemIds: string[]) {
    return new ItemManager(placeholderItemIds);
  }

  private getPlaceholderItemIds(): string[] {
    return this.placeholderItemIds;
  }

  private doesPlaceholderItemIdExist(itemId: string): boolean {
    return this.placeholderItemIds.some((id) => itemId === id);
  }

  /**
   * Add the placeholder item id
   * @returns isStateChanged
   */
  public addPlaceholderItemId(itemId: string): boolean {
    if (this.getItem(itemId)) {
      return false;
    }

    this.placeholderItemIds.push(itemId);
    this.publishPlaceholderItemIdsAdded([itemId]);
    return true;
  }

  /**
   * Remove the placeholder item id
   * @returns isStateChanged
   */
  public removePlaceholderItemId(itemId: string): boolean {
    if (!this.doesPlaceholderItemIdExist(itemId)) return false;

    this.placeholderItemIds = this.placeholderItemIds.filter((id) => id !== itemId);
    return true;
  }

  public getItem(itemId: string): ItemModel | null {
    return this.itemMap[itemId] || null;
  }

  /**
   * Add the item
   * @returns isStateChanged
   */
  public addItem(item: ItemModel): boolean {
    const itemId = item.getId();

    const existingItem = this.getItem(itemId);
    if (existingItem) return false;

    const isPlaceholderItemIdRemoved = this.removePlaceholderItemId(itemId);
    if (!isPlaceholderItemIdRemoved) return false;

    this.itemMap[itemId] = item;
    this.publishItemAdded(item);

    return true;
  }

  /**
   * Remove the item
   * @returns isStateChanged
   */
  public removeItem(itemId: string): boolean {
    const item = this.getItem(itemId);
    if (!item) return false;

    delete this.itemMap[itemId];
    this.placeholderItemIds.push(itemId);

    return true;
  }

  public subscribePlaceholderItemIdsAdded(handler: PlaceholderItemIdsAddedHandler): () => void {
    handler(this.getPlaceholderItemIds());

    this.placeholderItemIdsAddedHandlers.push(handler);

    return () => {
      this.placeholderItemIdsAddedHandlers = this.placeholderItemIdsAddedHandlers.filter((hdl) => hdl !== handler);
    };
  }

  private publishPlaceholderItemIdsAdded(placeholderItemIds: string[]) {
    this.placeholderItemIdsAddedHandlers.forEach((hdl) => {
      hdl(placeholderItemIds);
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
