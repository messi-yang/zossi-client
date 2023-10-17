export class PositionModel {
  constructor(private x: number, private z: number) {}

  static new = (x: number, z: number): PositionModel => new PositionModel(x, z);

  public isEqual(position: PositionModel): boolean {
    return this.x === position.getX() && this.z === position.getZ();
  }

  public getX(): number {
    return this.x;
  }

  public getZ(): number {
    return this.z;
  }

  public shift(x: number, z: number): PositionModel {
    return PositionModel.new(this.x + x, this.z + z);
  }

  public toString(): string {
    return `${this.x},${this.z}`;
  }

  public getPositionText(): string {
    return `(${this.x}, ${this.z})`;
  }
}
