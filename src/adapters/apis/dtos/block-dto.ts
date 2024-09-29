import { BlockVo } from '@/models/world/common/block-vo';

type BlockDto = {
  x: number;
  z: number;
};

export function parseBlockDto(blockDto: BlockDto): BlockVo {
  return BlockVo.create(blockDto.x, blockDto.z);
}

export function newBlockDto(block: BlockVo): BlockDto {
  return {
    x: block.getX(),
    z: block.getZ(),
  };
}

export type { BlockDto };
