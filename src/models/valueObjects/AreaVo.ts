import CoordinateVo from '@/models/valueObjects/CoordinateVo';

export default class AreaVo {
  private from: CoordinateVo;

  private to: CoordinateVo;

  constructor(from: CoordinateVo, to: CoordinateVo) {
    this.from = from;
    this.to = to;
  }

  static new(from: CoordinateVo, to: CoordinateVo): AreaVo {
    return new AreaVo(from, to);
  }

  public isEqual(area: AreaVo): Boolean {
    return this.from.isEqual(area.getFrom()) && this.to.isEqual(area.getTo());
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
