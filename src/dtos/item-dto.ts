import { ItemModel } from '@/models';

type ItemDto = {
  id: string;
  name: string;
  traversable: boolean;
  thumbnailSrc: string;
  modelSrc: string;
};

function convertItemDtoToItem(itemDto: ItemDto): ItemModel {
  return ItemModel.new(itemDto.id, itemDto.name, itemDto.traversable, itemDto.thumbnailSrc, itemDto.modelSrc);
}

export type { ItemDto };
export { convertItemDtoToItem };
