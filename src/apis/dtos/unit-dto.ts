import { DirectionModel } from '@/models/world/direction-model';
import { PositionModel } from '@/models/world/position-model';
import { UnitModel } from '@/models/world/unit-model';
import { PositionDto } from './position-dto';

type UnitDto = {
  itemId: string;
  position: PositionDto;
  direction: 0 | 1 | 2 | 3;
};

function parseUnitDto(unitDto: UnitDto): UnitModel {
  const position = PositionModel.new(unitDto.position.x, unitDto.position.z);
  const direction = DirectionModel.new(unitDto.direction);
  return UnitModel.new(unitDto.itemId, position, direction);
}

export type { UnitDto };
export { parseUnitDto };
