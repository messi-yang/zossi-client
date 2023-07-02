import { PositionModel } from '@/models';

type PositionDto = {
  x: number;
  z: number;
};

const newPositionDto = (position: PositionModel): PositionDto => ({ x: position.getX(), z: position.getZ() });

export type { PositionDto };
export { newPositionDto };
