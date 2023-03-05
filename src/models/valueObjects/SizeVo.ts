export default class SizeVo {
  private width: number;

  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  static new(width: number, height: number): SizeVo {
    return new SizeVo(width, height);
  }

  public isEqual(size: SizeVo): boolean {
    return this.width === size.width && this.height === size.height;
  }
}
