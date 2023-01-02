import cloneDeep from 'lodash/cloneDeep';

import MapUnitVo from './MapUnitVo';
import MapSizeVo from './MapSizeVo';

export default class GameMapVo {
  private mapUnitMatrix: MapUnitVo[][];

  constructor(mapUnitMatrix: MapUnitVo[][]) {
    this.mapUnitMatrix = mapUnitMatrix;
  }

  static new(mapUnitMatrix: MapUnitVo[][]): GameMapVo {
    return new GameMapVo(mapUnitMatrix);
  }

  static newWithMapSize(mapSize: MapSizeVo): GameMapVo {
    const gameMap = mapSize.map<MapUnitVo>(() => new MapUnitVo(null));
    return new GameMapVo(gameMap);
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
