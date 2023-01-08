import { RangeDto, LocationDto } from '@/apis/dtos';

enum ActionTypeEnum {
  Ping = 'PING',
  ObserveRange = 'OBSERVE_MAP_RANGE',
  BuildItem = 'BUILD_ITEM',
  DestroyItem = 'DESTROY_ITEM',
}

type PingAction = {
  type: ActionTypeEnum.Ping;
};

type ObserveRangeAction = {
  type: ActionTypeEnum.ObserveRange;
  payload: {
    range: RangeDto;
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

export type { PingAction, ObserveRangeAction, BuildItemAction, DestroyItemAction };
