export default class ItemAgg {
  private id: string;

  private name: string;

  private traversable: boolean;

  private assetSrc: string;

  private modelSrc: string;

  constructor(params: { id: string; name: string; traversable: boolean; assetSrc: string; modelSrc: string }) {
    this.id = params.id;
    this.name = params.name;
    this.traversable = params.traversable;
    this.assetSrc = params.assetSrc;
    this.modelSrc = params.modelSrc;
  }

  static new(params: { id: string; name: string; traversable: boolean; assetSrc: string; modelSrc: string }) {
    return new ItemAgg(params);
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getAssetSrc(): string {
    return this.assetSrc;
  }

  public getModelSrc(): string {
    return this.modelSrc;
  }
}
