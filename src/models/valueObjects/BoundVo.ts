import PositionVo from './PositionVo';

export default class BoundVo {
  private from: PositionVo;

  private to: PositionVo;

  constructor(from: PositionVo, to: PositionVo) {
    this.from = from;
    this.to = to;
  }

  static new(from: PositionVo, to: PositionVo): BoundVo {
    return new BoundVo(from, to);
  }

  public isEqual(bound: BoundVo): Boolean {
    return this.from.isEqual(bound.getFrom()) && this.to.isEqual(bound.getTo());
  }

  public getFrom(): PositionVo {
    return this.from;
  }

  public getTo(): PositionVo {
    return this.to;
  }
}
