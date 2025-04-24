import { EventHandler, EventHandlerSubscriber } from '../../../../event-dispatchers/common/event-handler';
import { PositionVo } from '@/models/world/common/position-vo';

const CAMERA_POSITION_LIST = [
  PositionVo.create(0, 0, 25), // From Top
  PositionVo.create(0, 15, 15), // From Front Top
  PositionVo.create(0, 15, 2), // From Front
];

export class PerspectiveManager {
  private perspectiveIndex: number;

  private cameraPositionChangedHandler = EventHandler.create<PositionVo>();

  constructor() {
    this.perspectiveIndex = 0;
  }

  static create() {
    return new PerspectiveManager();
  }

  public getCameraPosition(): PositionVo {
    return CAMERA_POSITION_LIST[this.perspectiveIndex];
  }

  public updateCameraPosition() {
    this.perspectiveIndex = (this.perspectiveIndex + 1) % CAMERA_POSITION_LIST.length;
    this.publishCameraPositionChangedEvent();
  }

  public subscribePerspectiveChangedEvent(subscriber: EventHandlerSubscriber<PositionVo>) {
    return this.cameraPositionChangedHandler.subscribe(subscriber);
  }

  private publishCameraPositionChangedEvent() {
    this.cameraPositionChangedHandler.publish(CAMERA_POSITION_LIST[this.perspectiveIndex]);
  }
}
