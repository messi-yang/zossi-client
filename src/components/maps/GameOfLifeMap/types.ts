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
