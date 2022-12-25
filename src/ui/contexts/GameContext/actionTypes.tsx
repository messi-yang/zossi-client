import { AreaDto, CoordinateDto } from '@/apis/dtos';

enum ActionTypeEnum {
  ZoomArea = 'ZOOM_AREA',
  BuildItem = 'BUILD_ITEM',
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
    coordinate: CoordinateDto;
    itemId: string;
    actionedAt: string;
  };
};

export { ActionTypeEnum };

export type { ZoomAreaAction, BuildItemAction };
