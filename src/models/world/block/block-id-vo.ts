import { PositionVo } from '../common/position-vo';
import { BLOCK_SIZE } from './const';

export class BlockIdVo {
  constructor(private worldId: string, private x: number, private z: number) {}

  static create(worldId: string, x: number, z: number) {
    return new BlockIdVo(worldId, x, z);
  }

  static createFromPosition(worldId: string, position: PositionVo) {
    return new BlockIdVo(worldId, Math.floor(position.getX() / BLOCK_SIZE), Math.floor(position.getZ() / BLOCK_SIZE));
  }

  public isEqual(otherBlockId: BlockIdVo) {
    return this.worldId === otherBlockId.worldId && this.x === otherBlockId.x && this.z === otherBlockId.z;
  }

  public getWorldId() {
    return this.worldId;
  }

  public getX() {
    return this.x;
  }

  public getZ() {
    return this.z;
  }

  public toString() {
    return `${this.worldId},${this.x},${this.z}`;
  }
}
