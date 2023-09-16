import { ItemModel } from '@/models/world/item-model';
import { UnitTypeModel } from '@/models/world/unit-type-model';

type ItemDto = {
  id: string;
  name: string;
  traversable: boolean;
  thumbnailSrc: string;
  modelSrc: string;
  compatibleUnitType: 'static' | 'portal';
};

function parseItemDto(itemDto: ItemDto): ItemModel {
  return ItemModel.new(
    itemDto.id,
    itemDto.name,
    itemDto.traversable,
    itemDto.thumbnailSrc,
    itemDto.modelSrc,
    UnitTypeModel.new(itemDto.compatibleUnitType)
  );
}

export type { ItemDto };
export { parseItemDto };
