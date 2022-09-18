import isEqual from 'lodash/isEqual';

import flatten from 'lodash/flatten';

class UnitPatternVo {
  private pattern: boolean[][];

  constructor(pattern: boolean[][]) {
    this.pattern = pattern;
  }

  public isEmpty(): boolean {
    return flatten(this.pattern).findIndex((alive) => alive) === -1;
  }

  public isEqual(pattern: UnitPatternVo): boolean {
    return isEqual(this.pattern, pattern.pattern);
  }

  public isAlive(colIdx: number, rowIdx: number): boolean {
    return this.pattern?.[colIdx]?.[rowIdx] || false;
  }

  public getWidth(): number {
    return this.pattern.length;
  }

  public getHeight(): number {
    return this.pattern?.[0].length || 0;
  }

  public setPatternUnit(colIdx: number, rowIdx: number, alive: boolean): void {
    this.pattern[colIdx][rowIdx] = alive;
  }

  public iterate(cb: (colIdx: number, rowIdx: number, alive: boolean) => void) {
    for (let colIdx = 0; colIdx < this.pattern.length; colIdx += 1) {
      for (let rowIdx = 0; rowIdx < this.pattern[0].length; rowIdx += 1) {
        cb(colIdx, rowIdx, this.isAlive(colIdx, rowIdx));
      }
    }
  }

  public mapPatternColumn(cb: (colIdx: number, patternCol: boolean[]) => any) {
    return this.pattern.map((patternCol, colIdx) => cb(colIdx, patternCol));
  }

  public mapPatternUnit(colIdx: number, cb: (rowIdx: number, alive: boolean) => any) {
    return this.pattern[colIdx].map((alive, rowIdx) => cb(rowIdx, alive));
  }
}

export default UnitPatternVo;
