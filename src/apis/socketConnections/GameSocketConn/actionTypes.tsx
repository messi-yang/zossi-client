import { MapRangeDto, LocationDto } from '@/apis/dtos';

enum ActionTypeEnum {
  ZoomMapRange = 'ZOOM_MAP_RANGE',
  BuildItem = 'BUILD_ITEM',
  DestroyItem = 'DESTROY_ITEM',
}

type ZoomMapRangeAction = {
  type: ActionTypeEnum.ZoomMapRange;
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

export type { ZoomMapRangeAction, BuildItemAction, DestroyItemAction };
