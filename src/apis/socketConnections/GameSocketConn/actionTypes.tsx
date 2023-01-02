import { AreaDto, LocationDto } from '@/apis/dtos';

enum ActionTypeEnum {
  ZoomArea = 'ZOOM_AREA',
  BuildItem = 'BUILD_ITEM',
  DestroyItem = 'DESTROY_ITEM',
}

type ZoomAreaAction = {
  type: ActionTypeEnum.ZoomArea;
  payload: {
    area: AreaDto;
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

export type { ZoomAreaAction, BuildItemAction, DestroyItemAction };
