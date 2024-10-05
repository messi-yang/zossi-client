import { BlockModel } from '@/models/world/block/block-model';
import { BlockIdDto, newBlockIdDto, parseBlockIdDto } from './block-id-dto';

type BlockDto = {
  id: BlockIdDto;
};

export function parseBlockDto(blockDto: BlockDto): BlockModel {
  return BlockModel.create(parseBlockIdDto(blockDto.id));
}

export function newBlockDto(block: BlockModel): BlockDto {
  return {
    id: newBlockIdDto(block.getId()),
  };
}

export type { BlockDto };
