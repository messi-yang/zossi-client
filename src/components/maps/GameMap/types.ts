export type Coordinate = {
  x: number;
  y: number;
};

export type Area = {
  from: Coordinate;
  to: Coordinate;
};

export type Unit = {
  key: string;
  coordinate: Coordinate;
  alive: boolean;
  age: number;
};
