import cloneDeep from 'lodash/cloneDeep';

import UnitVo from './UnitVo';
import SizeVo from './SizeVo';

export default class MapVo {
  private unitMatrix: UnitVo[][];

  constructor(unitMatrix: UnitVo[][]) {
    this.unitMatrix = unitMatrix;
  }

  static new(unitMatrix: UnitVo[][]): MapVo {
    return new MapVo(unitMatrix);
  }

  static newWithMapSize(mapSize: SizeVo): MapVo {
    const map = mapSize.map<UnitVo>(() => new UnitVo(null));
    return new MapVo(map);
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

  public getSize(): SizeVo {
    return SizeVo.new(this.getWidth(), this.getHeight());
  }

  public iterateUnit(cb: (colIdx: number, rowIdx: number, unit: UnitVo) => void) {
    for (let colIdx = 0; colIdx < this.unitMatrix.length; colIdx += 1) {
      for (let rowIdx = 0; rowIdx < this.unitMatrix[colIdx].length; rowIdx += 1) {
        cb(colIdx, rowIdx, this.unitMatrix[colIdx][rowIdx]);
      }
    }
  }
}
