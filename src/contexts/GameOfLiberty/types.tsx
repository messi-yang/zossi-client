type Coordinate = {
  x: number;
  y: number;
};

type MapSize = {
  width: number;
  height: number;
};

type Area = {
  from: Coordinate;
  to: Coordinate;
};

type Unit = {
  alive: boolean;
  age: number;
};

type Units = Unit[][];

type Status = 'OFFLINE' | 'ONLINE';

export type { Coordinate, Area, Unit, Units, Status, MapSize };
