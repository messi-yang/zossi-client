import { LocationVo } from '@/models/valueObjects';

export default class PlayerEntity {
  private id: string;

  private name: string;

  private location: LocationVo;

  private assetSrc: string;

  private imageElem: HTMLImageElement | null = null;

  constructor(params: { id: string; name: string; location: LocationVo }) {
    this.id = params.id;
    this.name = params.name;
    this.location = params.location;
    this.assetSrc = `https://avatars.dicebear.com/api/pixel-art/${params.id}.svg`;
  }

  static new(params: { id: string; name: string; location: LocationVo }): PlayerEntity {
    return new PlayerEntity(params);
  }

  public getId(): string {
    return this.id;
  }

  public getLocation(): LocationVo {
    return this.location;
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
