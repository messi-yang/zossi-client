import CoordinateVo from './CoordinateVo';

class AreaVo {
  public from: CoordinateVo;

  public to: CoordinateVo;

  constructor(from: CoordinateVo, to: CoordinateVo) {
    this.from = from;
    this.to = to;
  }
}

export default AreaVo;
