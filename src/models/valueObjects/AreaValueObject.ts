import CoordinateValueObject from '@/models/valueObjects/CoordinateValueObject';

export default class AreaValueObject {
  private from: CoordinateValueObject;

  private to: CoordinateValueObject;

  constructor(from: CoordinateValueObject, to: CoordinateValueObject) {
    this.from = from;
    this.to = to;
  }

  public isEqual(area: AreaValueObject): Boolean {
    return this.from.isEqual(area.getFrom()) && this.to.isEqual(area.getTo());
  }

  public getFrom(): CoordinateValueObject {
    return this.from;
  }

  public getTo(): CoordinateValueObject {
    return this.to;
  }

  public getWidth(): number {
    return this.to.getX() - this.from.getX() + 1;
  }

  public getHeight(): number {
    return this.to.getY() - this.from.getY() + 1;
  }
}
