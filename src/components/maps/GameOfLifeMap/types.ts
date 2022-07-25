export type Coordinate = {
  x: number;
  y: number;
};

export type Area = {
  from: Coordinate;
  to: Coordinate;
};

export type Unit = {
  alive: boolean;
  age: number;
};

/**
 * Represents units to revive in an area.
 * [
 *  [true, true, false], // (0, 0), (0, 1), (0, 2)
 *  [true, true, false], // (1, 0), (1, 1), (1, 2)
 *  [false, true, true], // (2, 0), (2, 1), (2, 2)
 * ]
 */
export type UnitsPattern = boolean[][];
