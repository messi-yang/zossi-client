import BoundVo from './BoundVo';
import UnitVo from './UnitVo';

export default class ViewVo {
  private bound: BoundVo;

  private units: UnitVo[];

  constructor(bound: BoundVo, units: UnitVo[]) {
    this.bound = bound;
    this.units = units;
  }

  static new(bound: BoundVo, units: UnitVo[]) {
    return new ViewVo(bound, units);
  }

  public getBound(): BoundVo {
    return this.bound;
  }

  public getUnits(): UnitVo[] {
    return this.units;
  }
}
