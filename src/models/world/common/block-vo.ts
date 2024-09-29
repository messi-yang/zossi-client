import { BoundVo } from './bound-vo';
import { DimensionVo } from './dimension-vo';
import { PositionVo } from './position-vo';

const BLOCK_SIZE = 50;

export class BlockVo {
  constructor(private x: number, private z: number) {}

  static create(x: number, z: number) {
    return new BlockVo(x, z);
  }

  static createFromPosition(position: PositionVo) {
    return new BlockVo(Math.floor(position.getX() / BLOCK_SIZE), Math.floor(position.getZ() / BLOCK_SIZE));
  }

  public isEqual(otherBlock: BlockVo) {
    return this.x === otherBlock.x && this.z === otherBlock.z;
  }

  public getX() {
    return this.x;
  }

  public getZ() {
    return this.z;
  }

  public getDimension() {
    return DimensionVo.create(BLOCK_SIZE, BLOCK_SIZE);
  }

  public getBound() {
    return new BoundVo(
      PositionVo.create(this.x * BLOCK_SIZE, this.z * BLOCK_SIZE),
      PositionVo.create((this.x + 1) * BLOCK_SIZE - 1, (this.z + 1) * BLOCK_SIZE - 1)
    );
  }

  public iterate(cb: (pos: PositionVo) => void) {
    for (let x = this.x * BLOCK_SIZE; x < (this.x + 1) * BLOCK_SIZE; x += 1) {
      for (let z = this.z * BLOCK_SIZE; z < (this.z + 1) * BLOCK_SIZE; z += 1) {
        cb(PositionVo.create(x, z));
      }
    }
  }

  public toString() {
    return `${this.x},${this.z}`;
  }
}
