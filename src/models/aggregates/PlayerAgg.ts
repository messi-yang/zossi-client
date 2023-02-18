import { LocationVo, DirectionVo } from '@/models/valueObjects';

export default class PlayerAgg {
  private id: string;

  private name: string;

  private location: LocationVo;

  private direction: DirectionVo;

  private assetSrc: string;

  private imageElem: HTMLImageElement | null = null;

  constructor(params: { id: string; name: string; location: LocationVo; direction: DirectionVo }) {
    this.id = params.id;
    this.name = params.name;
    this.location = params.location;
    this.direction = params.direction;
    this.assetSrc = `https://avatars.dicebear.com/api/pixel-art/${params.id}.svg`;
  }

  static new(params: { id: string; name: string; location: LocationVo; direction: DirectionVo }): PlayerAgg {
    return new PlayerAgg(params);
  }

  public getId(): string {
    return this.id;
  }

  public getLocation(): LocationVo {
    return this.location;
  }

  public getDirection(): DirectionVo {
    return this.direction;
  }

  public outputAssetAsImageElement(): HTMLImageElement | null {
    return this.imageElem;
  }
}
