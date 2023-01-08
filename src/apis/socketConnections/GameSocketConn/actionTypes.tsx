import { ExtentDto, LocationDto } from '@/apis/dtos';

enum ActionTypeEnum {
  Ping = 'PING',
  ObserveExtent = 'OBSERVE_MAP_RANGE',
  BuildItem = 'BUILD_ITEM',
  DestroyItem = 'DESTROY_ITEM',
}

type PingAction = {
  type: ActionTypeEnum.Ping;
};

type ObserveExtentAction = {
  type: ActionTypeEnum.ObserveExtent;
  payload: {
    extent: ExtentDto;
    actionedAt: string;
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

export type { PingAction, ObserveExtentAction, BuildItemAction, DestroyItemAction };
