import MapVo from './MapVo';
import BoundVo from './BoundVo';

export default class ViewVo {
  private bound: BoundVo;

  private map: MapVo;

  constructor(bound: BoundVo, map: MapVo) {
    this.bound = bound;
    this.map = map;
  }

  static new(bound: BoundVo, map: MapVo) {
    return new ViewVo(bound, map);
  }

  public getBound(): BoundVo {
    return this.bound;
  }

  public getMap(): MapVo {
    return this.map;
  }
}
