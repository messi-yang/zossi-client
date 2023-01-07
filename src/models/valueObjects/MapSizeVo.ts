import range from 'lodash/range';

export default class MapSizeVo {
  private width: number;

  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  static new(width: number, height: number): MapSizeVo {
    return new MapSizeVo(width, height);
  }

  static newWithResolutionAndUnitSize(
    resolution: { width: number; height: number },
    unitSideLength: number
  ): MapSizeVo {
    const width = Math.floor(resolution.width / unitSideLength) + 1;
    const height = Math.floor(resolution.height / unitSideLength) + 1;
    return new MapSizeVo(width, height);
  }

  public isEqual(mapSize: MapSizeVo): boolean {
    return this.width === mapSize.getWidth() && this.height === mapSize.getHeight();
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
