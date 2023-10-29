import { SizeVo } from '@/models/world/common/size-vo';

type SizeDto = {
  width: number;
  height: number;
};

function parseSizeDto(sizeDto: SizeDto): SizeVo {
  return SizeVo.new(sizeDto.width, sizeDto.height);
}

export type { SizeDto };
export { parseSizeDto };
