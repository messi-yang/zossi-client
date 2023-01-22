import { CameraVo, LocationVo } from '@/models/valueObjects';

export default class PlayerEntity {
  private id: string;

  private name: string;

  private camera: CameraVo;

  private location: LocationVo;

  private assetSrc: string;

  private imageElem: HTMLImageElement | null = null;

  constructor(params: { id: string; name: string; camera: CameraVo; location: LocationVo }) {
    this.id = params.id;
    this.name = params.name;
    this.camera = params.camera;
    this.location = params.location;
    this.assetSrc = `https://avatars.dicebear.com/api/pixel-art/${params.id}.svg`;
  }

  static new(params: { id: string; name: string; camera: CameraVo; location: LocationVo }): PlayerEntity {
    return new PlayerEntity(params);
  }

  public getCamera(): CameraVo {
    return this.camera;
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
