import { RangeDto, LocationDto } from '@/apis/dtos';
import ViewDto from '@/apis/dtos/ViewDto';

enum ActionTypeEnum {
  Ping = 'PING',
  ChangeView = 'CHANGE_VIEW',
  ObserveRange = 'OBSERVE_RANGE',
  BuildItem = 'BUILD_ITEM',
  DestroyItem = 'DESTROY_ITEM',
}

type PingAction = {
  type: ActionTypeEnum.Ping;
};

type ChangeViewAction = {
  type: ActionTypeEnum.ChangeView;
  payload: {
    view: ViewDto;
  };
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

export type { PingAction, ChangeViewAction, ObserveRangeAction, BuildItemAction, DestroyItemAction };
