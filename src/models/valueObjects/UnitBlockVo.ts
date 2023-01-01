import cloneDeep from 'lodash/cloneDeep';

import UnitVo from '@/models/valueObjects/UnitVo';

export default class UnitBlockVo {
  private unitMatrix: UnitVo[][];

  constructor(unitMatrix: UnitVo[][]) {
    this.unitMatrix = unitMatrix;
  }

  static new(unitMatrix: UnitVo[][]): UnitBlockVo {
    return new UnitBlockVo(unitMatrix);
  }

  public getUnit(colIdx: number, rowIdx: number): UnitVo {
    return this.unitMatrix[colIdx][rowIdx];
  }

  public getWidth(): number {
    return this.unitMatrix.length;
  }

  public getHeight(): number {
    return this.unitMatrix[0].length;
  }

  public getUnitMatrix(): UnitVo[][] {
    return cloneDeep(this.unitMatrix);
  }

  public iterateUnit(cb: (colIdx: number, rowIdx: number, unit: UnitVo) => void) {
    for (let colIdx = 0; colIdx < this.unitMatrix.length; colIdx += 1) {
      for (let rowIdx = 0; rowIdx < this.unitMatrix[colIdx].length; rowIdx += 1) {
        cb(colIdx, rowIdx, this.unitMatrix[colIdx][rowIdx]);
      }
    }
  }
}
