import { EventHandler, EventHandlerSubscriber } from '../../../../event-dispatchers/common/event-handler';

export class SelectionManager {
  private selectedUnitId: string | null = null;

  private selectedUnitIdUpdatedHandler = EventHandler.create<[string | null, string | null]>();

  private draggedUnitId: string | null = null;

  private draggedUnitIdUpdatedHandler = EventHandler.create<[string | null, string | null]>();

  private selectedItemId: string | null = null;

  private selectedItemIdUpdatedHandler = EventHandler.create<[string | null, string | null]>();

  static create() {
    return new SelectionManager();
  }

  public getSelectedUnitId(): string | null {
    return this.selectedUnitId;
  }

  public selectUnit(unitId: string) {
    const oldUnitId = this.selectedUnitId;
    this.selectedUnitId = unitId;
    this.publishSelectedUnitIdUpdated(oldUnitId, unitId);

    this.clearDraggedUnit();
    this.clearSelectedItem();
  }

  public clearSelectedUnit() {
    if (!this.selectedUnitId) return;
    const oldUnitId = this.selectedUnitId;
    this.selectedUnitId = null;
    this.publishSelectedUnitIdUpdated(oldUnitId, null);
  }

  public subscribeSelectedUnitIdUpdated(handler: EventHandlerSubscriber<[string | null, string | null]>): () => void {
    return this.selectedUnitIdUpdatedHandler.subscribe(handler);
  }

  private publishSelectedUnitIdUpdated(oldUnitId: string | null, newUnitId: string | null) {
    this.selectedUnitIdUpdatedHandler.publish([oldUnitId, newUnitId]);
  }

  public getDraggedUnitId(): string | null {
    return this.draggedUnitId;
  }

  public dragUnit(unitId: string) {
    const oldUnitId = this.draggedUnitId;
    this.draggedUnitId = unitId;
    this.publishDraggedUnitIdUpdated(oldUnitId, unitId);

    this.clearSelectedUnit();
    this.clearSelectedItem();
  }

  public clearDraggedUnit() {
    if (!this.draggedUnitId) return;

    const oldUnitId = this.draggedUnitId;
    this.draggedUnitId = null;
    this.publishDraggedUnitIdUpdated(oldUnitId, null);
  }

  public subscribeDraggedUnitIdUpdated(handler: EventHandlerSubscriber<[string | null, string | null]>): () => void {
    return this.draggedUnitIdUpdatedHandler.subscribe(handler);
  }

  private publishDraggedUnitIdUpdated(oldUnitId: string | null, newUnitId: string | null) {
    this.draggedUnitIdUpdatedHandler.publish([oldUnitId, newUnitId]);
  }

  public getSelectedItemId(): string | null {
    return this.selectedItemId;
  }

  public selectItem(itemId: string) {
    const oldItemId = this.selectedItemId;
    this.selectedItemId = itemId;
    this.publishSelectedItemIdUpdated(oldItemId, itemId);

    this.clearDraggedUnit();
    this.clearSelectedUnit();
  }

  public clearSelectedItem() {
    if (!this.selectedItemId) return;
    const oldItemId = this.selectedItemId;
    this.selectedItemId = null;
    this.publishSelectedItemIdUpdated(oldItemId, null);
  }

  public subscribeSelectedItemIdUpdated(handler: EventHandlerSubscriber<[string | null, string | null]>): () => void {
    return this.selectedItemIdUpdatedHandler.subscribe(handler);
  }

  private publishSelectedItemIdUpdated(oldItemId: string | null, newItemId: string | null) {
    this.selectedItemIdUpdatedHandler.publish([oldItemId, newItemId]);
  }
}
