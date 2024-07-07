import { ItemModel } from '@/models/world/item/item-model';
import { EventHandler, EventHandlerSubscriber } from '../common/event-handler';

export class ItemManager {
  /**
   * Placeholder item means the item that is required by the client but missing.
   */
  private placeholderItemIds: string[];

  private itemMap: Record<string, ItemModel | undefined>;

  private itemAddedEventHandler = EventHandler.create<ItemModel>();

  private placeholderItemIdsAddedEventHandler = EventHandler.create<string[]>();

  constructor() {
    this.placeholderItemIds = [];
    this.itemMap = {};
  }

  static create() {
    return new ItemManager();
  }

  private getPlaceholderItemIds(): string[] {
    return this.placeholderItemIds;
  }

  /**
   * Add placeholder item id to let the manager know we are missing this item.
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
   */
  private removePlaceholderItemId(itemId: string): void {
    this.placeholderItemIds = this.placeholderItemIds.filter((id) => id !== itemId);
  }

  public getItem(itemId: string): ItemModel | null {
    return this.itemMap[itemId] || null;
  }

  /**
   * Load item
   */
  public loadItem(item: ItemModel): void {
    const itemId = item.getId();

    const existingItem = this.getItem(itemId);
    if (existingItem) return;

    this.removePlaceholderItemId(itemId);
    this.itemMap[itemId] = item;
    this.publishItemAddedEvent(item);
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

  public subscribePlaceholderItemIdsAddedEvent(subscriber: EventHandlerSubscriber<string[]>): () => void {
    const placeholderItemIds = this.getPlaceholderItemIds();
    if (placeholderItemIds.length > 0) {
      subscriber(placeholderItemIds);
    }

    return this.placeholderItemIdsAddedEventHandler.subscribe(subscriber);
  }

  private publishPlaceholderItemIdsAdded(placeholderItemIds: string[]) {
    this.placeholderItemIdsAddedEventHandler.publish(placeholderItemIds);
  }

  public subscribeItemAddedEvent(subscriber: EventHandlerSubscriber<ItemModel>): () => void {
    Object.values(this.itemMap).forEach((item) => {
      if (item) {
        subscriber(item);
      }
    });

    return this.itemAddedEventHandler.subscribe(subscriber);
  }

  private publishItemAddedEvent(item: ItemModel) {
    this.itemAddedEventHandler.publish(item);
  }
}
