import { PositionVo, DirectionVo } from '@/models/valueObjects';

export default class PlayerAgg {
  private id: string;

  private name: string;

  private position: PositionVo;

  private direction: DirectionVo;

  private assetSrc: string;

  private imageElem: HTMLImageElement | null = null;

  constructor(params: { id: string; name: string; position: PositionVo; direction: DirectionVo }) {
    this.id = params.id;
    this.name = params.name;
    this.position = params.position;
    this.direction = params.direction;
    this.assetSrc = `https://avatars.dicebear.com/api/pixel-art/${params.id}.svg`;
  }

  static new(params: { id: string; name: string; position: PositionVo; direction: DirectionVo }): PlayerAgg {
    return new PlayerAgg(params);
  }

  public getId(): string {
    return this.id;
  }

  public getPosition(): PositionVo {
    return this.position;
  }

  public getDirection(): DirectionVo {
    return this.direction;
  }

  public outputAssetAsImageElement(): HTMLImageElement | null {
    return this.imageElem;
  }
}
