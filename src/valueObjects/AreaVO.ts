import CoordinateVo from './CoordinateVo';
import OffsetVo from './OffsetVo';

class AreaVo {
  private from: CoordinateVo;

  private to: CoordinateVo;

  constructor(from: CoordinateVo, to: CoordinateVo) {
    this.from = from;
    this.to = to;
  }

  public isEqual(area: AreaVo): Boolean {
    return this.from.isEqual(area.getFrom()) && this.to.isEqual(area.getTo());
  }

  public calculateOffset(area: AreaVo): OffsetVo {
    return new OffsetVo(this.from.getX() - area.getFrom().getX(), this.from.getY() - area.getFrom().getY());
  }

  public getFrom(): CoordinateVo {
    return this.from;
  }

  public getTo(): CoordinateVo {
    return this.to;
  }

  public getWidth(): number {
    return this.to.getX() - this.from.getX() + 1;
  }

  public getHeight(): number {
    return this.to.getY() - this.from.getY() + 1;
  }
}

export default AreaVo;
