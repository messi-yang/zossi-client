import { ItemModel } from '@/models/world/item/item-model';
import { EventHandler, EventHandlerSubscriber } from '../../../../event-dispatchers/common/event-handler';
import { UnitManager } from '../unit-manager';
import { UnitModel } from '@/models/world/unit/unit-model';
import { ItemManager } from '../item-manager';

export class SelectionManager {
  private selectedUnitId: string | null = null;

  private selectedUnitUpdatedHandler = EventHandler.create<[UnitModel | null, UnitModel | null]>();

  private draggedUnitId: string | null = null;

  private draggedUnitUpdatedHandler = EventHandler.create<[UnitModel | null, UnitModel | null]>();

  private selectedItemId: string | null = null;

  private selectedItemUpdatedHandler = EventHandler.create<[ItemModel | null, ItemModel | null]>();

  private unitManager: UnitManager;

  private itemManager: ItemManager;

  constructor(unitManager: UnitManager, itemManager: ItemManager) {
    this.unitManager = unitManager;
    this.itemManager = itemManager;

    this.unitManager.subscribeUnitRemovedEvent((oldUnit) => {
      const oldUnitId = oldUnit.getId();
      if (this.selectedUnitId && oldUnitId === this.selectedUnitId) {
        this.clearSelectedUnit();
      }
      if (this.draggedUnitId && oldUnitId === this.draggedUnitId) {
        this.clearDraggedUnit();
      }
    });
  }

  static create(unitManager: UnitManager, itemManager: ItemManager) {
    return new SelectionManager(unitManager, itemManager);
  }

  public resetSelection() {
    this.clearSelectedUnit();
    this.clearDraggedUnit();
    this.clearSelectedItem();
  }

  public getSelectedUnitId(): string | null {
    return this.selectedUnitId;
  }

  public selectUnit(unitId: string) {
    if (!this.unitManager.hasUnit(unitId)) return;

    const oldUnitId = this.selectedUnitId;
    this.selectedUnitId = unitId;

    const oldUnit = oldUnitId ? this.unitManager.getUnit(oldUnitId) : null;
    const newUnit = this.unitManager.getUnit(unitId);
    this.publishSelectedUnitUpdated(oldUnit, newUnit);

    this.clearDraggedUnit();
    this.clearSelectedItem();
  }

  public clearSelectedUnit() {
    if (!this.selectedUnitId) return;
    const oldUnitId = this.selectedUnitId;
    this.selectedUnitId = null;

    const oldUnit = oldUnitId ? this.unitManager.getUnit(oldUnitId) : null;
    this.publishSelectedUnitUpdated(oldUnit, null);
  }

  public subscribeSelectedUnitUpdated(handler: EventHandlerSubscriber<[UnitModel | null, UnitModel | null]>): () => void {
    return this.selectedUnitUpdatedHandler.subscribe(handler);
  }

  private publishSelectedUnitUpdated(oldUnit: UnitModel | null, newUnit: UnitModel | null) {
    this.selectedUnitUpdatedHandler.publish([oldUnit, newUnit]);
  }

  public dragUnit(unitId: string) {
    if (!this.unitManager.hasUnit(unitId)) return;

    const oldUnitId = this.draggedUnitId;
    this.draggedUnitId = unitId;

    const oldUnit = oldUnitId ? this.unitManager.getUnit(oldUnitId) : null;
    const newUnit = this.unitManager.getUnit(unitId);
    this.publishDraggedUnitUpdated(oldUnit, newUnit);

    this.clearSelectedUnit();
    this.clearSelectedItem();
  }

  public getDraggedUnit(): UnitModel | null {
    if (!this.draggedUnitId) return null;
    return this.unitManager.getUnit(this.draggedUnitId);
  }

  public clearDraggedUnit() {
    if (!this.draggedUnitId) return;

    const oldUnitId = this.draggedUnitId;
    this.draggedUnitId = null;
    const oldUnit = oldUnitId ? this.unitManager.getUnit(oldUnitId) : null;
    this.publishDraggedUnitUpdated(oldUnit, null);
  }

  public subscribeDraggedUnitUpdated(handler: EventHandlerSubscriber<[UnitModel | null, UnitModel | null]>): () => void {
    return this.draggedUnitUpdatedHandler.subscribe(handler);
  }

  private publishDraggedUnitUpdated(oldUnit: UnitModel | null, newUnit: UnitModel | null) {
    this.draggedUnitUpdatedHandler.publish([oldUnit, newUnit]);
  }

  public getSelectedItem(): ItemModel | null {
    if (!this.selectedItemId) return null;
    return this.itemManager.getItem(this.selectedItemId);
  }

  public selectItem(itemId: string) {
    const oldItemId = this.selectedItemId;
    this.selectedItemId = itemId;
    const oldItem = oldItemId ? this.itemManager.getItem(oldItemId) : null;
    const newItem = this.itemManager.getItem(itemId);
    this.publishSelectedItemUpdated(oldItem, newItem);

    this.clearDraggedUnit();
    this.clearSelectedUnit();
  }

  public clearSelectedItem() {
    if (!this.selectedItemId) return;
    const oldItemId = this.selectedItemId;
    this.selectedItemId = null;
    const oldItem = oldItemId ? this.itemManager.getItem(oldItemId) : null;
    this.publishSelectedItemUpdated(oldItem, null);
  }

  public subscribeSelectedItemUpdated(handler: EventHandlerSubscriber<[ItemModel | null, ItemModel | null]>): () => void {
    return this.selectedItemUpdatedHandler.subscribe(handler);
  }

  private publishSelectedItemUpdated(oldItem: ItemModel | null, newItem: ItemModel | null) {
    this.selectedItemUpdatedHandler.publish([oldItem, newItem]);
  }
}
