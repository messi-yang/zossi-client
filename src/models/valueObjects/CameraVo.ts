import LocationVo from './LocationVo';

export default class CameraVo {
  private center: LocationVo;

  constructor(center: LocationVo) {
    this.center = center;
  }

  static new(center: LocationVo): CameraVo {
    return new CameraVo(center);
  }

  public getCenter(): LocationVo {
    return this.center;
  }
}
