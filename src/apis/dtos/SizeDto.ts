import { SizeVo } from '@/models/valueObjects';

type SizeDto = {
  width: number;
  height: number;
};

function convertSizeDtoToSize(sizeDto: SizeDto): SizeVo {
  return SizeVo.new(sizeDto.width, sizeDto.height);
}

export type { SizeDto };
export { convertSizeDtoToSize };
