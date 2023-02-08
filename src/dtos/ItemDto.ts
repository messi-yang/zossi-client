import { ItemAgg } from '@/models/aggregates';

type ItemDto = {
  id: number;
  name: string;
  traversable: boolean;
  assetSrc: string;
};

function convertItemDtoToItem(itemDto: ItemDto): ItemAgg {
  return ItemAgg.new({
    id: itemDto.id,
    name: itemDto.name,
    traversable: itemDto.traversable,
    assetSrc: itemDto.assetSrc,
  });
}

export type { ItemDto };
export { convertItemDtoToItem };
