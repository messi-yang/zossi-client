import LocationVo from './LocationVo';

export default class BoundVo {
  private from: LocationVo;

  private to: LocationVo;

  constructor(from: LocationVo, to: LocationVo) {
    this.from = from;
    this.to = to;
  }

  static new(from: LocationVo, to: LocationVo): BoundVo {
    return new BoundVo(from, to);
  }

  public isEqual(bound: BoundVo): Boolean {
    return this.from.isEqual(bound.getFrom()) && this.to.isEqual(bound.getTo());
  }

  public getFrom(): LocationVo {
    return this.from;
  }

  public getTo(): LocationVo {
    return this.to;
  }
}
