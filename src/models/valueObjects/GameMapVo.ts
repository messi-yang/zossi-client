import cloneDeep from 'lodash/cloneDeep';

import GameMapUnitVo from './GameMapUnitVo';
import MapSizeVo from './MapSizeVo';

export default class GameMapVo {
  private gameMapUnitMatrix: GameMapUnitVo[][];

  constructor(gameMapUnitMatrix: GameMapUnitVo[][]) {
    this.gameMapUnitMatrix = gameMapUnitMatrix;
  }

  static new(gameMapUnitMatrix: GameMapUnitVo[][]): GameMapVo {
    return new GameMapVo(gameMapUnitMatrix);
  }

  static newWithMapSize(mapSize: MapSizeVo): GameMapVo {
    const gameMap = mapSize.map<GameMapUnitVo>(() => new GameMapUnitVo(null));
    return new GameMapVo(gameMap);
  }

  public getUnit(colIdx: number, rowIdx: number): GameMapUnitVo {
    return this.gameMapUnitMatrix[colIdx][rowIdx];
  }

  public getWidth(): number {
    return this.gameMapUnitMatrix.length;
  }

  public getHeight(): number {
    return this.gameMapUnitMatrix[0].length;
  }

  public getGameMapUnitMatrix(): GameMapUnitVo[][] {
    return cloneDeep(this.gameMapUnitMatrix);
  }

  public getMapSize(): MapSizeVo {
    return MapSizeVo.new(this.getWidth(), this.getHeight());
  }

  public iterateGameMapUnit(cb: (colIdx: number, rowIdx: number, gameMapUnit: GameMapUnitVo) => void) {
    for (let colIdx = 0; colIdx < this.gameMapUnitMatrix.length; colIdx += 1) {
      for (let rowIdx = 0; rowIdx < this.gameMapUnitMatrix[colIdx].length; rowIdx += 1) {
        cb(colIdx, rowIdx, this.gameMapUnitMatrix[colIdx][rowIdx]);
      }
    }
  }
}
