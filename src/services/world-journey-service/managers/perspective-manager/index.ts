import { PrecisePositionVo } from '@/models/world/common/precise-position-vo';

export type PerspectiveChangedHandler = (perspectiveDepth: number, targetPrecisePosition: PrecisePositionVo) => void;

export class PerspectiveManager {
  private depth: number;

  private targetPrecisePosition: PrecisePositionVo;

  private perspectiveChangedHandlers: PerspectiveChangedHandler[] = [];

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

  public subscribePerspectiveChanged(handler: PerspectiveChangedHandler): () => void {
    handler(this.depth, this.targetPrecisePosition);

    this.perspectiveChangedHandlers.push(handler);

    return () => {
      this.perspectiveChangedHandlers = this.perspectiveChangedHandlers.filter((hdl) => hdl !== handler);
    };
  }

  private publishPerspectiveChanged() {
    this.perspectiveChangedHandlers.forEach((hdl) => {
      hdl(this.depth, this.targetPrecisePosition);
    });
  }
}
