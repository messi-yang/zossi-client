import range from 'lodash/range';

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

  static newWithResolutionAndUnitSize(resolution: { width: number; height: number }, unitSideLength: number): SizeVo {
    const width = Math.floor(resolution.width / unitSideLength) + 1;
    const height = Math.floor(resolution.height / unitSideLength) + 1;
    return new SizeVo(width, height);
  }

  public isEqual(size: SizeVo): boolean {
    return this.width === size.getWidth() && this.height === size.getHeight();
  }

  public getWidth(): number {
    return this.width;
  }

  public getHeight(): number {
    return this.height;
  }

  public getRatio(): number {
    return this.height / this.width;
  }

  public iterateColumn(cb: (colIdx: number) => void) {
    range(this.width).forEach((colIdx) => cb(colIdx));
  }

  public iterateRow(cb: (rowIdx: number) => void) {
    range(this.height).forEach((rowIdx) => cb(rowIdx));
  }

  public map<T>(cb: (colIdx: number, rowIdx: number) => T): T[][] {
    return range(this.width).map((colIdx) => range(this.height).map((rowIdx) => cb(colIdx, rowIdx)));
  }
}
