export type Coordinate = {
  x: number;
  y: number;
};

export type Unit = {
  coordinate: Coordinate;
  alive: boolean;
  age: number;
};
