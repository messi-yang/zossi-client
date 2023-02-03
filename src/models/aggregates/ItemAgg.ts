export default class ItemAgg {
  private id: string;

  private name: string;

  private traversable: boolean;

  private assetSrc: string;

  private imageElem: HTMLImageElement | null = null;

  constructor(params: { id: string; name: string; traversable: boolean; assetSrc: string }) {
    this.id = params.id;
    this.name = params.name;
    this.traversable = params.traversable;
    this.assetSrc = params.assetSrc;
  }

  static new(params: { id: string; name: string; traversable: boolean; assetSrc: string }) {
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

  public outputAssetAsImageElement(): HTMLImageElement | null {
    return this.imageElem;
  }

  public async loadAsset() {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        this.imageElem = image;
        resolve(true);
      };

      image.src = this.assetSrc;
    });
  }
}
