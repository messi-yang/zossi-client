import { ItemModel } from '@/models/world/item/item-model';
import { EventHandler, EventHandlerSubscriber } from '../../../../event-dispatchers/common/event-handler';
import { UnitManager } from '../unit-manager';
import { UnitModel } from '@/models/world/unit/unit-model';
import { ItemManager } from '../item-manager';
import { PositionVo } from '@/models/world/common/position-vo';
import { DirectionVo } from '@/models/world/common/direction-vo';
import { PlayerManager } from '../player-manager';

export class SelectionManager {
  private hoveredPosition: PositionVo = PositionVo.create(0, 0, 0);

  private selectedUnitId: string | null = null;

  private selectedUnitAddedHandler = EventHandler.create<UnitModel>();

  private selectedUnitRemovedHandler = EventHandler.create<void>();

  private draggedUnitId: string | null = null;

  private draggedUnitAddedHandler = EventHandler.create<{ unit: UnitModel; position: PositionVo }>();

  private draggedUnitPositionUpdatedHandler =
    EventHandler.create<[{ unit: UnitModel; position: PositionVo }, { unit: UnitModel; position: PositionVo }]>();

  private draggedUnitRemovedHandler = EventHandler.create<void>();

  private selectedItemId: string | null = null;

  private selectedItemDirection = DirectionVo.newDown();

  private selectedItemAddedHandler = EventHandler.create<{ item: ItemModel; position: PositionVo; direction: DirectionVo }>();

  private selectedItemUpdatedHandler =
    EventHandler.create<
      [{ item: ItemModel; position: PositionVo; direction: DirectionVo }, { item: ItemModel; position: PositionVo; direction: DirectionVo }]
    >();

  private selectedItemRemovedHandler = EventHandler.create<void>();

  private unitManager: UnitManager;

  private itemManager: ItemManager;

  private playerManager: PlayerManager;

  constructor(unitManager: UnitManager, itemManager: ItemManager, playerManager: PlayerManager) {
    this.unitManager = unitManager;
    this.itemManager = itemManager;
    this.playerManager = playerManager;

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

  static create(unitManager: UnitManager, itemManager: ItemManager, playerManager: PlayerManager) {
    return new SelectionManager(unitManager, itemManager, playerManager);
  }

  public resetSelection() {
    this.clearSelectedUnit();
    this.clearDraggedUnit();
    this.clearSelectedItem();
  }

  public hoverPosition(position: PositionVo) {
    const oldHoveredPosition = this.hoveredPosition;
    this.hoveredPosition = position;

    const selectedItem = this.getSelectedItem();
    if (selectedItem) {
      this.publishSelectedItemUpdated(
        { item: selectedItem, position: oldHoveredPosition, direction: this.selectedItemDirection },
        {
          item: selectedItem,
          position: this.hoveredPosition,
          direction: this.selectedItemDirection,
        }
      );
    }

    const draggedUnit = this.getDraggedUnit();
    if (draggedUnit) {
      this.publishDraggedUnitPositionUpdated(
        { unit: draggedUnit, position: oldHoveredPosition },
        { unit: draggedUnit, position: this.hoveredPosition }
      );
    }
  }

  public getHoveredPosition(): PositionVo | null {
    return this.hoveredPosition;
  }

  public getSelectedUnitId(): string | null {
    return this.selectedUnitId;
  }

  public selectUnit(unitId: string) {
    const newUnit = this.unitManager.getUnit(unitId);
    if (!newUnit) return;

    this.selectedUnitId = unitId;

    this.publishSelectedUnitAdded(newUnit);

    this.clearDraggedUnit();
    this.clearSelectedItem();
  }

  public clearSelectedUnit() {
    if (!this.selectedUnitId) return;
    this.selectedUnitId = null;

    this.publishSelectedUnitRemoved();
  }

  public subscribeSelectedUnitAdded(handler: EventHandlerSubscriber<UnitModel>): () => void {
    return this.selectedUnitAddedHandler.subscribe(handler);
  }

  private publishSelectedUnitAdded(unit: UnitModel) {
    this.selectedUnitAddedHandler.publish(unit);
  }

  public subscribeSelectedUnitRemoved(handler: EventHandlerSubscriber<void>): () => void {
    return this.selectedUnitRemovedHandler.subscribe(handler);
  }

  private publishSelectedUnitRemoved() {
    this.selectedUnitRemovedHandler.publish();
  }

  public dragUnit(unitId: string) {
    const newUnit = this.unitManager.getUnit(unitId);
    if (!newUnit) return;

    this.draggedUnitId = unitId;

    this.publishDraggedUnitAdded(newUnit, this.hoveredPosition);

    this.clearSelectedUnit();
    this.clearSelectedItem();
  }

  public getDraggedUnit(): UnitModel | null {
    if (!this.draggedUnitId) return null;
    return this.unitManager.getUnit(this.draggedUnitId);
  }

  public clearDraggedUnit() {
    if (!this.draggedUnitId) return;

    this.draggedUnitId = null;
    this.publishDraggedUnitRemoved();
  }

  public subscribeDraggedUnitAdded(handler: EventHandlerSubscriber<{ unit: UnitModel; position: PositionVo }>): () => void {
    return this.draggedUnitAddedHandler.subscribe(handler);
  }

  public subscribeDraggedUnitPositionUpdated(
    handler: EventHandlerSubscriber<[{ unit: UnitModel; position: PositionVo }, { unit: UnitModel; position: PositionVo }]>
  ): () => void {
    return this.draggedUnitPositionUpdatedHandler.subscribe(handler);
  }

  private publishDraggedUnitPositionUpdated(
    oldParams: { unit: UnitModel; position: PositionVo },
    newParams: { unit: UnitModel; position: PositionVo }
  ) {
    this.draggedUnitPositionUpdatedHandler.publish([oldParams, newParams]);
  }

  private publishDraggedUnitAdded(unit: UnitModel, position: PositionVo) {
    this.draggedUnitAddedHandler.publish({ unit, position });
  }

  public subscribeDraggedUnitRemoved(handler: EventHandlerSubscriber<void>): () => void {
    return this.draggedUnitRemovedHandler.subscribe(handler);
  }

  private publishDraggedUnitRemoved() {
    this.draggedUnitRemovedHandler.publish();
  }

  public getSelectedItem(): ItemModel | null {
    if (!this.selectedItemId) return null;
    return this.itemManager.getItem(this.selectedItemId);
  }

  public getSelectedItemDirection(): DirectionVo {
    return this.selectedItemDirection;
  }

  public selectItem(itemId: string) {
    const newItem = this.itemManager.getItem(itemId);
    if (!newItem) return;

    this.selectedItemId = itemId;
    this.selectedItemDirection = DirectionVo.newDown();

    this.publishSelectedItemAdded(newItem, this.hoveredPosition, this.selectedItemDirection);

    this.clearDraggedUnit();
    this.clearSelectedUnit();
  }

  public rotateSelectedItem() {
    const selectedItem = this.getSelectedItem();
    if (!selectedItem) return;

    const oldDirection = this.selectedItemDirection;
    this.selectedItemDirection = this.selectedItemDirection.rotate();
    this.publishSelectedItemUpdated(
      { item: selectedItem, position: this.hoveredPosition, direction: oldDirection },
      { item: selectedItem, position: this.hoveredPosition, direction: this.selectedItemDirection }
    );
  }

  public clearSelectedItem() {
    if (!this.selectedItemId) return;
    this.selectedItemId = null;

    this.publishSelectedItemRemoved();
  }

  public subscribeSelectedItemAdded(
    handler: EventHandlerSubscriber<{ item: ItemModel; position: PositionVo; direction: DirectionVo }>
  ): () => void {
    return this.selectedItemAddedHandler.subscribe(handler);
  }

  private publishSelectedItemAdded(item: ItemModel, position: PositionVo, direction: DirectionVo) {
    this.selectedItemAddedHandler.publish({ item, position, direction });
  }

  public subscribeSelectedItemUpdated(
    handler: EventHandlerSubscriber<
      [{ item: ItemModel; position: PositionVo; direction: DirectionVo }, { item: ItemModel; position: PositionVo; direction: DirectionVo }]
    >
  ): () => void {
    return this.selectedItemUpdatedHandler.subscribe(handler);
  }

  private publishSelectedItemUpdated(
    oldParams: { item: ItemModel; position: PositionVo; direction: DirectionVo },
    newParams: { item: ItemModel; position: PositionVo; direction: DirectionVo }
  ) {
    this.selectedItemUpdatedHandler.publish([oldParams, newParams]);
  }

  public subscribeSelectedItemRemoved(handler: EventHandlerSubscriber<void>): () => void {
    return this.selectedItemRemovedHandler.subscribe(handler);
  }

  private publishSelectedItemRemoved() {
    this.selectedItemRemovedHandler.publish();
  }
}
