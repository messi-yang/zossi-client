import isEqual from 'lodash/isEqual';
import cloneDeep from 'lodash/cloneDeep';
import flatten from 'lodash/flatten';
import range from 'lodash/range';

const isRowEmpty = (pattern: boolean[][], rowIdx: number): boolean => {
  for (let colIdx = 0; colIdx < pattern.length; colIdx += 1) {
    if (pattern[colIdx][rowIdx]) {
      return false;
    }
  }
  return true;
};

const isColEmpty = (pattern: boolean[][], colIdx: number): boolean => {
  for (let rowIdx = 0; rowIdx < pattern[0].length; rowIdx += 1) {
    if (pattern[colIdx][rowIdx]) {
      return false;
    }
  }
  return true;
};

const addTopEmptyRow = (pattern: boolean[][]) => {
  pattern.forEach((patternCol) => {
    patternCol.unshift(false);
  });
};

const addLeftEmptyRow = (pattern: boolean[][]) => {
  pattern.unshift(range(pattern[0].length).map(() => false));
};

const addBottomEmptyRow = (pattern: boolean[][]) => {
  pattern.forEach((patternCol) => {
    patternCol.push(false);
  });
};

const addRightEmptyRow = (pattern: boolean[][]) => {
  pattern.push(range(pattern[0].length).map(() => false));
};

const removeTopEmptyRows = (pattern: boolean[][]) => {
  while (true) {
    if (pattern[0].length <= 1) {
      return;
    }
    if (!isRowEmpty(pattern, 0)) {
      return;
    }
    pattern.forEach((patternCol) => {
      patternCol.shift();
    });
  }
};

const removeLeftEmptyRows = (pattern: boolean[][]) => {
  while (true) {
    if (pattern.length <= 1) {
      return;
    }
    if (!isColEmpty(pattern, 0)) {
      return;
    }
    pattern.shift();
  }
};

const removeBottomEmptyRows = (pattern: boolean[][]) => {
  while (true) {
    if (pattern[0].length <= 1) {
      return;
    }
    if (!isRowEmpty(pattern, pattern[0].length - 1)) {
      return;
    }
    pattern.forEach((patternCol) => {
      patternCol.pop();
    });
  }
};

const removeRightEmptyRows = (pattern: boolean[][]) => {
  while (true) {
    if (pattern.length <= 1) {
      return;
    }
    if (!isColEmpty(pattern, pattern.length - 1)) {
      return;
    }
    pattern.pop();
  }
};

export default class UnitPatternValueObject {
  private pattern: boolean[][];

  constructor(pattern: boolean[][]) {
    this.pattern = pattern;
  }

  public isEmpty(): boolean {
    return flatten(this.pattern).findIndex((alive) => alive) === -1;
  }

  public isEqual(pattern: UnitPatternValueObject): boolean {
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

  public setPatternUnit(colIdx: number, rowIdx: number, alive: boolean): UnitPatternValueObject {
    const newPattern = cloneDeep(this.pattern);
    newPattern[colIdx][rowIdx] = alive;
    return new UnitPatternValueObject(newPattern);
  }

  public addFillerBorder(): UnitPatternValueObject {
    const newPattern = cloneDeep(this.pattern);
    removeTopEmptyRows(newPattern);
    removeBottomEmptyRows(newPattern);
    removeLeftEmptyRows(newPattern);
    removeRightEmptyRows(newPattern);

    addTopEmptyRow(newPattern);
    addBottomEmptyRow(newPattern);
    addLeftEmptyRow(newPattern);
    addRightEmptyRow(newPattern);
    return new UnitPatternValueObject(newPattern);
  }

  public iterate(cb: (colIdx: number, rowIdx: number, alive: boolean) => void) {
    for (let colIdx = 0; colIdx < this.pattern.length; colIdx += 1) {
      for (let rowIdx = 0; rowIdx < this.pattern[0].length; rowIdx += 1) {
        cb(colIdx, rowIdx, this.isAlive(colIdx, rowIdx));
      }
    }
  }

  public map<T>(cb: (colIdx: number, rowIdx: number, alive: boolean) => T): T[][] {
    return this.pattern.map((patternCol, colIdx) => patternCol.map((alive, rowIdx) => cb(colIdx, rowIdx, alive)));
  }

  public mapPatternColumn(cb: (colIdx: number, patternCol: boolean[]) => any) {
    return this.pattern.map((patternCol, colIdx) => cb(colIdx, patternCol));
  }

  public mapPatternUnit(colIdx: number, cb: (rowIdx: number, alive: boolean) => any) {
    return this.pattern[colIdx].map((alive, rowIdx) => cb(rowIdx, alive));
  }
}
