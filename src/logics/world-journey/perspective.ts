import { PositionModel } from '@/models/world/common/position-model';

export type PerspectiveChangedHandler = (perspectiveDepth: number, targetPos: PositionModel) => void;

export class Perspective {
  private depth: number;

  private targetPos: PositionModel;

  private perspectiveChangedHandlers: PerspectiveChangedHandler[] = [];

  constructor(depth: number, targetPos: PositionModel) {
    this.depth = depth;
    this.targetPos = targetPos;
  }

  static new(depth: number, targetPos: PositionModel) {
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

  public updateTargetPos(position: PositionModel) {
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
