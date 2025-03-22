import { PositionVo } from '@/models/world/common/position-vo';
import { EventHandler } from '../common/event-handler';

export type SelectedPositionChangedHandler = ([oldSelectedPosition, newSelectedPosition]: [PositionVo | null, PositionVo | null]) => void;

export class SelectionManager {
  private selectedPosition: PositionVo | null = null;

  private selectedPositionChangedHandler = EventHandler.create<[PositionVo | null, PositionVo | null]>();

  static create() {
    return new SelectionManager();
  }

  public getSelectedPosition(): PositionVo | null {
    return this.selectedPosition;
  }

  public selectPosition(position: PositionVo) {
    const oldPosition = this.selectedPosition;
    this.selectedPosition = position;
    this.publishSelectedPositionChanged(oldPosition, position);
  }

  public clearSelectedPosition() {
    const oldPosition = this.selectedPosition;
    this.selectedPosition = null;
    this.publishSelectedPositionChanged(oldPosition, null);
  }

  public subscribeSelectedPositionChanged(handler: SelectedPositionChangedHandler): () => void {
    return this.selectedPositionChangedHandler.subscribe(handler);
  }

  private publishSelectedPositionChanged(oldPosition: PositionVo | null, newPosition: PositionVo | null) {
    this.selectedPositionChangedHandler.publish([oldPosition, newPosition]);
  }
}
