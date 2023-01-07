import { MapRangeDto, LocationDto } from '@/apis/dtos';

enum ActionTypeEnum {
  Ping = 'PING',
  ObserveMapRange = 'OBSERVE_MAP_RANGE',
  BuildItem = 'BUILD_ITEM',
  DestroyItem = 'DESTROY_ITEM',
}

type PingAction = {
  type: ActionTypeEnum.Ping;
};

type ObserveMapRangeAction = {
  type: ActionTypeEnum.ObserveMapRange;
  payload: {
    mapRange: MapRangeDto;
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

export type { PingAction, ObserveMapRangeAction, BuildItemAction, DestroyItemAction };
