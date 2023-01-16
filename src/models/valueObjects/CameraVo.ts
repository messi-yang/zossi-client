import SizeVo from './SizeVo';
import LocationVo from './LocationVo';
import BoundVo from './BoundVo';

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

  public getViewBoundInMap(mapSize: SizeVo, screenSize: SizeVo): BoundVo {
    const standarizedX = Math.round(this.center.getX() - screenSize.getWidth() / 2);
    const standarizedY = Math.round(this.center.getY() - screenSize.getHeight() / 2);
    let adjustedX = standarizedX;
    let adjustedY = standarizedY;
    if (standarizedX + screenSize.getWidth() - 1 > mapSize.getWidth() - 1) {
      adjustedX = mapSize.getWidth() - screenSize.getWidth();
    } else if (standarizedX < 0) {
      adjustedX = 0;
    }
    if (standarizedY + screenSize.getHeight() - 1 > mapSize.getHeight() - 1) {
      adjustedY = mapSize.getHeight() - screenSize.getHeight();
    } else if (standarizedY < 0) {
      adjustedY = 0;
    }

    return BoundVo.new(
      LocationVo.new(adjustedX, adjustedY),
      LocationVo.new(adjustedX + screenSize.getWidth() - 1, adjustedY + screenSize.getHeight() - 1)
    );
  }
}
