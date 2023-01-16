import { LocationDto } from '@/dtos';
import CameraDto from '@/dtos/CameraDto';

enum ActionTypeEnum {
  Ping = 'PING',
  ChangeCamera = 'CHANGE_CAMERA',
  BuildItem = 'BUILD_ITEM',
  DestroyItem = 'DESTROY_ITEM',
}

type PingAction = {
  type: ActionTypeEnum.Ping;
};

type ChangeCameraAction = {
  type: ActionTypeEnum.ChangeCamera;
  payload: {
    camera: CameraDto;
  };
};

type BuildItemAction = {
  type: ActionTypeEnum.BuildItem;
  payload: {
    location: LocationDto;
    itemId: string;
    actionedAt: string;
  };
};

type DestroyItemAction = {
  type: ActionTypeEnum.DestroyItem;
  payload: {
    location: LocationDto;
    actionedAt: string;
  };
};

export { ActionTypeEnum };

export type { PingAction, ChangeCameraAction, BuildItemAction, DestroyItemAction };