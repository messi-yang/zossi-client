import { PrecisePositionVo } from '@/models/world/common/precise-position-vo';
import { EventHandler, EventHandlerSubscriber } from '../common/event-handler';

export type PerspectiveChangedHandler = (perspectiveDepth: number, targetPrecisePosition: PrecisePositionVo) => void;

export class PerspectiveManager {
  private depth: number;

  private targetPrecisePosition: PrecisePositionVo;

  private perspectiveChangedHandler = EventHandler.create<[perspectiveDepth: number, targetPrecisePosition: PrecisePositionVo]>();

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
    this.publishPerspectiveChangedEvent();
    return true;
  }

  /**
   * Subtract perspective depth
   * @returns isStateChanged
   */
  public subtractPerspectiveDepth(): boolean {
    if (this.depth >= 200) return false;

    this.depth += 10;
    this.publishPerspectiveChangedEvent();
    return true;
  }

  public updateTargetPrecisePosition(position: PrecisePositionVo) {
    this.targetPrecisePosition = position;
    this.publishPerspectiveChangedEvent();
  }

  public subscribePerspectiveChangedEvent(
    subscriber: EventHandlerSubscriber<[perspectiveDepth: number, targetPrecisePosition: PrecisePositionVo]>
  ): () => void {
    subscriber([this.depth, this.targetPrecisePosition]);

    return this.perspectiveChangedHandler.subscribe(subscriber);
  }

  private publishPerspectiveChangedEvent() {
    this.perspectiveChangedHandler.publish([this.depth, this.targetPrecisePosition]);
  }
}
