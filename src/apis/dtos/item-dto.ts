import { ItemModel } from '@/models';

type ItemDto = {
  id: string;
  name: string;
  traversable: boolean;
  thumbnailSrc: string;
  modelSrc: string;
};

function convertItemDtoToItem(itemDto: ItemDto): ItemModel {
  return ItemModel.new({
    id: itemDto.id,
    name: itemDto.name,
    traversable: itemDto.traversable,
    thumbnailSrc: itemDto.thumbnailSrc,
    modelSrc: itemDto.modelSrc,
  });
}

export type { ItemDto };
export { convertItemDtoToItem };
