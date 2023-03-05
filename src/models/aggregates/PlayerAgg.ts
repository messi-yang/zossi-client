import { PositionVo, DirectionVo } from '@/models/valueObjects';

export default class PlayerAgg {
  private id: string;

  private name: string;

  private position: PositionVo;

  private direction: DirectionVo;

  constructor(params: { id: string; name: string; position: PositionVo; direction: DirectionVo }) {
    this.id = params.id;
    this.name = params.name;
    this.position = params.position;
    this.direction = params.direction;
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
}
