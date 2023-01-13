import BoundDto from './BoundDto';
import UnitDto from './UnitDto';

type ViewDto = {
  map: UnitDto[][];
  bound: BoundDto;
};

export default ViewDto;
