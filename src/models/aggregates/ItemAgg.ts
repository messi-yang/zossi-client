export default class ItemAgg {
  private id: number;

  private name: string;

  private traversable: boolean;

  private assetSrc: string;

  private modelSrc: string;

  private imageElem: HTMLImageElement | null = null;

  constructor(params: { id: number; name: string; traversable: boolean; assetSrc: string; modelSrc: string }) {
    this.id = params.id;
    this.name = params.name;
    this.traversable = params.traversable;
    this.assetSrc = params.assetSrc;
    this.modelSrc = params.modelSrc;
  }

  static new(params: { id: number; name: string; traversable: boolean; assetSrc: string; modelSrc: string }) {
    return new ItemAgg(params);
  }

  public getId(): number {
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
