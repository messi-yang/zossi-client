import MapVo from './MapVo';
import RangeVo from './RangeVo';

export default class ViewVo {
  private range: RangeVo;

  private map: MapVo;

  constructor(range: RangeVo, map: MapVo) {
    this.range = range;
    this.map = map;
  }

  static new(range: RangeVo, map: MapVo) {
    return new ViewVo(range, map);
  }

  public getRange(): RangeVo {
    return this.range;
  }

  public getmap(): MapVo {
    return this.map;
  }
}
