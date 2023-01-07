import cloneDeep from 'lodash/cloneDeep';

import MapUnitVo from './MapUnitVo';
import MapSizeVo from './MapSizeVo';

export default class UnitMapVo {
  private mapUnitMatrix: MapUnitVo[][];

  constructor(mapUnitMatrix: MapUnitVo[][]) {
    this.mapUnitMatrix = mapUnitMatrix;
  }

  static new(mapUnitMatrix: MapUnitVo[][]): UnitMapVo {
    return new UnitMapVo(mapUnitMatrix);
  }

  static newWithMapSize(mapSize: MapSizeVo): UnitMapVo {
    const unitMap = mapSize.map<MapUnitVo>(() => new MapUnitVo(null));
    return new UnitMapVo(unitMap);
  }

  public getUnit(colIdx: number, rowIdx: number): MapUnitVo {
    return this.mapUnitMatrix[colIdx][rowIdx];
  }

  public getWidth(): number {
    return this.mapUnitMatrix.length;
  }

  public getHeight(): number {
    return this.mapUnitMatrix[0].length;
  }

  public getMapUnitMatrix(): MapUnitVo[][] {
    return cloneDeep(this.mapUnitMatrix);
  }

  public getMapSize(): MapSizeVo {
    return MapSizeVo.new(this.getWidth(), this.getHeight());
  }

  public iterateMapUnit(cb: (colIdx: number, rowIdx: number, mapUnit: MapUnitVo) => void) {
    for (let colIdx = 0; colIdx < this.mapUnitMatrix.length; colIdx += 1) {
      for (let rowIdx = 0; rowIdx < this.mapUnitMatrix[colIdx].length; rowIdx += 1) {
        cb(colIdx, rowIdx, this.mapUnitMatrix[colIdx][rowIdx]);
      }
    }
  }
}
