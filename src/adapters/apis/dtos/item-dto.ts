import { ItemModel } from '@/models/world/item/item-model';
import { UnitTypeEnum } from '@/models/world/unit/unit-type-enum';
import { DimensionDto, parseDimensionDto } from './dimension-dto';

type ItemDto = {
  id: string;
  name: string;
  dimension: DimensionDto;
  traversable: boolean;
  thumbnailSrc: string;
  modelSources: string[];
  compatibleUnitType: UnitTypeEnum;
};

function parseItemDto(dto: ItemDto): ItemModel {
  return ItemModel.new(
    dto.id,
    dto.name,
    parseDimensionDto(dto.dimension),
    dto.traversable,
    dto.thumbnailSrc,
    dto.modelSources,
    dto.compatibleUnitType
  );
}

export type { ItemDto };
export { parseItemDto };
