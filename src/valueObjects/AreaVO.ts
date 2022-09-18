import CoordinateVO from '@/valueObjects/CoordinateVO';

export default class AreaVO {
  private from: CoordinateVO;

  private to: CoordinateVO;

  constructor(from: CoordinateVO, to: CoordinateVO) {
    this.from = from;
    this.to = to;
  }

  public isEqual(area: AreaVO): Boolean {
    return this.from.isEqual(area.getFrom()) && this.to.isEqual(area.getTo());
  }

  public getFrom(): CoordinateVO {
    return this.from;
  }

  public getTo(): CoordinateVO {
    return this.to;
  }

  public getWidth(): number {
    return this.to.getX() - this.from.getX() + 1;
  }

  public getHeight(): number {
    return this.to.getY() - this.from.getY() + 1;
  }
}
