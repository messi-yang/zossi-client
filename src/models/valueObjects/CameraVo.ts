import DimensionVo from './DimensionVo';
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

  public calculateBoundInMap(mapDimension: DimensionVo, screenDimension: DimensionVo): BoundVo {
    const standarizedX = Math.round(this.center.getX() - screenDimension.getWidth() / 2);
    const standarizedY = Math.round(this.center.getY() - screenDimension.getHeight() / 2);
    let adjustedX = standarizedX;
    let adjustedY = standarizedY;
    if (standarizedX + screenDimension.getWidth() - 1 > mapDimension.getWidth() - 1) {
      adjustedX = mapDimension.getWidth() - screenDimension.getWidth();
    } else if (standarizedX < 0) {
      adjustedX = 0;
    }
    if (standarizedY + screenDimension.getHeight() - 1 > mapDimension.getHeight() - 1) {
      adjustedY = mapDimension.getHeight() - screenDimension.getHeight();
    } else if (standarizedY < 0) {
      adjustedY = 0;
    }

    return BoundVo.new(
      LocationVo.new(adjustedX, adjustedY),
      LocationVo.new(adjustedX + screenDimension.getWidth() - 1, adjustedY + screenDimension.getHeight() - 1)
    );
  }
}
