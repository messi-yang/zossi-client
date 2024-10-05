import { BlockVo } from '@/models/world/block/block-vo';
import { BlockIdDto, newBlockIdDto, parseBlockIdDto } from './block-id-dto';

type BlockDto = {
  id: BlockIdDto;
};

export function parseBlockDto(blockDto: BlockDto): BlockVo {
  return BlockVo.create(parseBlockIdDto(blockDto.id));
}

export function newBlockDto(block: BlockVo): BlockDto {
  return {
    id: newBlockIdDto(block.getId()),
  };
}

export type { BlockDto };
