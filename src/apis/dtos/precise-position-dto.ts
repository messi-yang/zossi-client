import { PrecisePositionVo } from '@/models/world/common/precise-position-vo';

type PrecisePositionDto = {
  x: number;
  z: number;
};

const newPrecisePositionDto = (position: PrecisePositionVo): PrecisePositionDto => ({
  x: position.getX(),
  z: position.getZ(),
});

export type { PrecisePositionDto };
export { newPrecisePositionDto };
