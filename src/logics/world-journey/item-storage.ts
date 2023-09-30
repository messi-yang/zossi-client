import { ItemModel } from '@/models/world/item-model';

type PlaceholderItemIdsAddedHandler = (placeholderItemIds: string[]) => void;
type ItemAddedHandler = (item: ItemModel) => void;

export class ItemStorage {
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
    return new ItemStorage(placeholderItemIds);
  }

  private getPlaceholderItemIds(): string[] {
    return this.placeholderItemIds;
  }

  public addPlaceholderItemId(itemId: string) {
    if (this.itemMap[itemId]) {
      return;
    }

    this.placeholderItemIds.push(itemId);
    this.publishPlaceholderItemIdsAdded([itemId]);
  }

  public removePlaceholderItemId(itemId: string) {
    this.placeholderItemIds = this.placeholderItemIds.filter((id) => id !== itemId);
  }

  public getItem(itemId: string): ItemModel | null {
    return this.itemMap[itemId] || null;
  }

  public addItem(item: ItemModel): boolean {
    const itemId = item.getId();

    const existingItem = this.itemMap[itemId];
    if (existingItem) return false;

    this.removePlaceholderItemId(itemId);

    this.itemMap[itemId] = item;
    this.publishItemAdded(item);

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
