import { PositionModel } from '@/models/world/common/position-model';

type PositionDto = {
  x: number;
  z: number;
};

const newPositionDto = (position: PositionModel): PositionDto => ({ x: position.getX(), z: position.getZ() });

export type { PositionDto };
export { newPositionDto };
