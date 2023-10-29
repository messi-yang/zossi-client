import { PositionVo } from '@/models/world/common/position-vo';

export type PerspectiveChangedHandler = (perspectiveDepth: number, targetPos: PositionVo) => void;

export class Perspective {
  private depth: number;

  private targetPos: PositionVo;

  private perspectiveChangedHandlers: PerspectiveChangedHandler[] = [];

  constructor(depth: number, targetPos: PositionVo) {
    this.depth = depth;
    this.targetPos = targetPos;
  }

  static new(depth: number, targetPos: PositionVo) {
    return new Perspective(depth, targetPos);
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

  public updateTargetPos(position: PositionVo) {
    this.targetPos = position;
    this.publishPerspectiveChanged();
  }

  public subscribePerspectiveChanged(handler: PerspectiveChangedHandler): () => void {
    handler(this.depth, this.targetPos);

    this.perspectiveChangedHandlers.push(handler);

    return () => {
      this.perspectiveChangedHandlers = this.perspectiveChangedHandlers.filter((hdl) => hdl !== handler);
    };
  }

  private publishPerspectiveChanged() {
    this.perspectiveChangedHandlers.forEach((hdl) => {
      hdl(this.depth, this.targetPos);
    });
  }
}
