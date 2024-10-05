import { BlockIdVo } from '@/models/world/block/block-id-vo';

type BlockIdDto = {
  worldId: string;
  x: number;
  z: number;
};

export function parseBlockIdDto(blockDto: BlockIdDto): BlockIdVo {
  return BlockIdVo.create(blockDto.worldId, blockDto.x, blockDto.z);
}

export function newBlockIdDto(block: BlockIdVo): BlockIdDto {
  return {
    worldId: block.getWorldId(),
    x: block.getX(),
    z: block.getZ(),
  };
}

export type { BlockIdDto };
