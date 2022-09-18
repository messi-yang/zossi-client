import range from 'lodash/range';

export default class MapSizeVo {
  private width: number;

  private height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
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
