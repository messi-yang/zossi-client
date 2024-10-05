import { BoundVo } from '../common/bound-vo';
import { DimensionVo } from '../common/dimension-vo';
import { PositionVo } from '../common/position-vo';
import { BlockIdVo } from './block-id-vo';
import { BLOCK_SIZE } from './const';

export class BlockVo {
  constructor(private id: BlockIdVo) {}

  static create(id: BlockIdVo) {
    return new BlockVo(id);
  }

  public getId() {
    return this.id;
  }

  public getDimension() {
    return DimensionVo.create(BLOCK_SIZE, BLOCK_SIZE);
  }

  public getBound() {
    const x = this.id.getX();
    const z = this.id.getZ();

    return new BoundVo(
      PositionVo.create(x * BLOCK_SIZE, z * BLOCK_SIZE),
      PositionVo.create((x + 1) * BLOCK_SIZE - 1, (z + 1) * BLOCK_SIZE - 1)
    );
  }

  public iterate(cb: (pos: PositionVo) => void) {
    const x = this.id.getX();
    const z = this.id.getZ();

    for (let xIdx = x * BLOCK_SIZE; xIdx < (x + 1) * BLOCK_SIZE; xIdx += 1) {
      for (let zIdx = z * BLOCK_SIZE; zIdx < (z + 1) * BLOCK_SIZE; zIdx += 1) {
        cb(PositionVo.create(xIdx, zIdx));
      }
    }
  }
}
