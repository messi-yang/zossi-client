import { ItemModel } from '@/models/world/item/item-model';
import { UnitTypeEnum } from '@/models/world/unit/unit-type-enum';
import { UnitTypeVo } from '@/models/world/unit/unit-type-vo';

type ItemDto = {
  id: string;
  name: string;
  traversable: boolean;
  thumbnailSrc: string;
  modelSrc: string;
  compatibleUnitType: UnitTypeEnum;
};

function parseItemDto(itemDto: ItemDto): ItemModel {
  return ItemModel.new(
    itemDto.id,
    itemDto.name,
    itemDto.traversable,
    itemDto.thumbnailSrc,
    itemDto.modelSrc,
    UnitTypeVo.new(itemDto.compatibleUnitType)
  );
}

export type { ItemDto };
export { parseItemDto };
