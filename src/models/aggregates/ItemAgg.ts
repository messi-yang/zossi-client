export default class ItemAgg {
  private id: string;

  private name: string;

  private traversable: boolean;

  private thumbnailSrc: string;

  private modelSrc: string;

  constructor(params: { id: string; name: string; traversable: boolean; thumbnailSrc: string; modelSrc: string }) {
    this.id = params.id;
    this.name = params.name;
    this.traversable = params.traversable;
    this.thumbnailSrc = params.thumbnailSrc;
    this.modelSrc = params.modelSrc;
  }

  static new(params: { id: string; name: string; traversable: boolean; thumbnailSrc: string; modelSrc: string }) {
    return new ItemAgg(params);
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getThumbnailSrc(): string {
    return this.thumbnailSrc;
  }

  public getModelSrc(): string {
    return this.modelSrc;
  }
}
