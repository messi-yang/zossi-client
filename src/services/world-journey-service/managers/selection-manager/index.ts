import { EventHandler, EventHandlerSubscriber } from '../../../../event-dispatchers/common/event-handler';

export class SelectionManager {
  private selectedUnitId: string | null = null;

  private selectedUnitIdUpdatedHandler = EventHandler.create<[string | null, string | null]>();

  private draggedUnitId: string | null = null;

  private draggedUnitIdUpdatedHandler = EventHandler.create<[string | null, string | null]>();

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
}
