export class DimensionVo {
  constructor(private width: number, private depth: number) {}

  static new = (width: number, depth: number): DimensionVo => {
    return new DimensionVo(width, depth);
  };

  public isEqual(dimension: DimensionVo): Boolean {
    return this.width === dimension.width && this.depth === dimension.depth;
  }

  public getWidth(): number {
    return this.width;
  }

  public getDepth(): number {
    return this.depth;
  }

  public isSymmetric(): boolean {
    return this.width === this.depth;
  }
}
