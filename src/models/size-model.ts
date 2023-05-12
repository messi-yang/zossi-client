export class SizeModel {
  private width: number;

  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  static new(width: number, height: number): SizeModel {
    return new SizeModel(width, height);
  }

  public isEqual(size: SizeModel): boolean {
    return this.width === size.width && this.height === size.height;
  }
}
