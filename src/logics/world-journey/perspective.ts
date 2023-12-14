import { PrecisePositionVo } from '@/models/world/common/precise-position-vo';

export type PerspectiveChangedHandler = (perspectiveDepth: number, targetPrecisePosition: PrecisePositionVo) => void;

export class Perspective {
  private depth: number;

  private targetPrecisePosition: PrecisePositionVo;

  private perspectiveChangedHandlers: PerspectiveChangedHandler[] = [];

  constructor(depth: number, targetPrecisePosition: PrecisePositionVo) {
    this.depth = depth;
    this.targetPrecisePosition = targetPrecisePosition;
  }

  static new(depth: number, targetPrecisePosition: PrecisePositionVo) {
    return new Perspective(depth, targetPrecisePosition);
  }

  public addPerspectiveDepth() {
    if (this.depth <= 10) return;
    this.depth -= 10;
    this.publishPerspectiveChanged();
  }

  public subtractPerspectiveDepth() {
    if (this.depth >= 200) return;
    this.depth += 10;
    this.publishPerspectiveChanged();
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
