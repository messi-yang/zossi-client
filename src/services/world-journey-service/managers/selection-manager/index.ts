import { EventHandler } from '../common/event-handler';

export type SelectedUnitIdChangedHandler = ([oldSelectedUnitId, newSelectedUnitId]: [string | null, string | null]) => void;

export class SelectionManager {
  private selectedUnitId: string | null = null;

  private selectedUnitIdChangedHandler = EventHandler.create<[string | null, string | null]>();

  static create() {
    return new SelectionManager();
  }

  public getSelectedUnitId(): string | null {
    return this.selectedUnitId;
  }

  public selectUnitId(unitId: string) {
    const oldUnitId = this.selectedUnitId;
    this.selectedUnitId = unitId;
    this.publishSelectedUnitIdChanged(oldUnitId, unitId);
  }

  public clearSelectedUnitId() {
    const oldUnitId = this.selectedUnitId;
    this.selectedUnitId = null;
    this.publishSelectedUnitIdChanged(oldUnitId, null);
  }

  public subscribeSelectedUnitIdChanged(handler: SelectedUnitIdChangedHandler): () => void {
    return this.selectedUnitIdChangedHandler.subscribe(handler);
  }

  private publishSelectedUnitIdChanged(oldUnitId: string | null, newUnitId: string | null) {
    this.selectedUnitIdChangedHandler.publish([oldUnitId, newUnitId]);
  }
}
