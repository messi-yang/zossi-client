export class SizeVo {
  constructor(private width: number, private height: number) {}

  static new = (width: number, height: number): SizeVo => new SizeVo(width, height);

  public isEqual(size: SizeVo): boolean {
    return this.width === size.width && this.height === size.height;
  }

  public getWidth(): number {
    return this.width;
  }

  public getHeight(): number {
    return this.height;
  }
}
