import CoordinateEntity from './CoordinateEntity';

type UnitEntity = {
  coordinate: CoordinateEntity;
  alive: boolean;
  age: number;
};

export default UnitEntity;
