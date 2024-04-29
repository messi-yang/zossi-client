import { DimensionVo } from '@/models/world/common/dimension-vo';

type DimensionDto = {
  width: number;
  depth: number;
};

export function parseDimensionDto(dto: DimensionDto): DimensionVo {
  return DimensionVo.create(dto.width, dto.depth);
}

export function newDimensionDto(dimension: DimensionVo): DimensionDto {
  return {
    width: dimension.getWidth(),
    depth: dimension.getDepth(),
  };
}

export type { DimensionDto };
