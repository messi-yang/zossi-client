import isEqual from 'lodash/isEqual';

import flatten from 'lodash/flatten';

class UnitPatternVo {
  private unitPattern: boolean[][];

  constructor(unitPattern: boolean[][]) {
    this.unitPattern = unitPattern;
  }

  public isEmpty(): boolean {
    return flatten(this.unitPattern).findIndex((alive) => alive) === -1;
  }

  public isEqual(unitPattern: UnitPatternVo): boolean {
    return isEqual(this.unitPattern, unitPattern.unitPattern);
  }

  public isAlive(colIdx: number, rowIdx: number): boolean {
    return this.unitPattern?.[colIdx]?.[rowIdx] || false;
  }

  public getWidth(): number {
    return this.unitPattern.length;
  }

  public getHeight(): number {
    return this.unitPattern?.[0].length || 0;
  }

  public setPatternUnit(colIdx: number, rowIdx: number, alive: boolean): void {
    this.unitPattern[colIdx][rowIdx] = alive;
  }

  public iterate(cb: (colIdx: number, rowIdx: number, alive: boolean) => void) {
    for (let colIdx = 0; colIdx < this.unitPattern.length; colIdx += 1) {
      for (let rowIdx = 0; rowIdx < this.unitPattern[0].length; rowIdx += 1) {
        cb(colIdx, rowIdx, this.isAlive(colIdx, rowIdx));
      }
    }
  }

  public mapPatternColumn(cb: (colIdx: number, patternCol: boolean[]) => any) {
    return this.unitPattern.map((unitPatternCol, colIdx) => cb(colIdx, unitPatternCol));
  }

  public mapPatternUnit(colIdx: number, cb: (rowIdx: number, alive: boolean) => any) {
    return this.unitPattern[colIdx].map((alive, rowIdx) => cb(rowIdx, alive));
  }
}

export default UnitPatternVo;
