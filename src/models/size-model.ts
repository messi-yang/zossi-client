export class SizeModel {
  constructor(private width: number, private height: number) {}

  static new = (width: number, height: number): SizeModel => new SizeModel(width, height);

  public isEqual(size: SizeModel): boolean {
    return this.width === size.width && this.height === size.height;
  }
}
