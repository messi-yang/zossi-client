import { CameraVo, LocationVo } from '@/models/valueObjects';

export default class PlayerEntity {
  private id: string;

  private name: string;

  private camera: CameraVo;

  private location: LocationVo;

  constructor(params: { id: string; name: string; camera: CameraVo; location: LocationVo }) {
    this.id = params.id;
    this.name = params.name;
    this.camera = params.camera;
    this.location = params.location;
  }

  static new(params: { id: string; name: string; camera: CameraVo; location: LocationVo }): PlayerEntity {
    return new PlayerEntity(params);
  }
}
