import { UnitModel, DirectionModel, PositionModel } from '@/models';
import { PositionDto } from './position-dto';

type UnitDto = {
  itemId: string;
  position: PositionDto;
  direction: 0 | 1 | 2 | 3;
};

function convertUnitDtoToUnit(unitDto: UnitDto): UnitModel {
  const position = PositionModel.new(unitDto.position.x, unitDto.position.z);
  const direction = DirectionModel.new(unitDto.direction);
  return UnitModel.new(unitDto.itemId, position, direction);
}

export type { UnitDto };
export { convertUnitDtoToUnit };
