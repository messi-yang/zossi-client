import { PrecisePositionVo } from '@/models/world/common/precise-position-vo';
import { EventHandler, EventHandlerSubscriber } from '../common/event-handler';

export type PerspectiveChangedHandler = (perspectiveDepth: number, targetPrecisePosition: PrecisePositionVo) => void;

export class PerspectiveManager {
  private depth: number;

  private targetPrecisePosition: PrecisePositionVo;

  private perspectiveChangedHandler =
    EventHandler.create<[perspectiveDepth: number, targetPrecisePosition: PrecisePositionVo]>();

  constructor(depth: number, targetPrecisePosition: PrecisePositionVo) {
    this.depth = depth;
    this.targetPrecisePosition = targetPrecisePosition;
  }

  static create(depth: number, targetPrecisePosition: PrecisePositionVo) {
    return new PerspectiveManager(depth, targetPrecisePosition);
  }

  /**
   * Add perspective depth
   * @returns isStateChanged
   */
  public addPerspectiveDepth(): boolean {
    if (this.depth <= 10) return false;

    this.depth -= 10;
    this.publishPerspectiveChanged();
    return true;
  }

  /**
   * Subtract perspective depth
   * @returns isStateChanged
   */
  public subtractPerspectiveDepth(): boolean {
    if (this.depth >= 200) return false;

    this.depth += 10;
    this.publishPerspectiveChanged();
    return true;
  }

  public updateTargetPrecisePosition(position: PrecisePositionVo) {
    this.targetPrecisePosition = position;
    this.publishPerspectiveChanged();
  }

  public subscribePerspectiveChanged(
    subscriber: EventHandlerSubscriber<[perspectiveDepth: number, targetPrecisePosition: PrecisePositionVo]>
  ): () => void {
    subscriber([this.depth, this.targetPrecisePosition]);

    return this.perspectiveChangedHandler.subscribe(subscriber);
  }

  private publishPerspectiveChanged() {
    this.perspectiveChangedHandler.publish([this.depth, this.targetPrecisePosition]);
  }
}
