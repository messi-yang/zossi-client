import { AreaDto, CoordinateDto } from '@/dtos';

enum ActionTypeEnum {
  ZoomArea = 'ZOOM_AREA',
  ReviveUnits = 'REVIVE_UNITS',
}

type ZoomAreaAction = {
  type: ActionTypeEnum.ZoomArea;
  payload: {
    area: AreaDto;
    actionedAt: string;
  };
};

type ReviveUnitsAction = {
  type: ActionTypeEnum.ReviveUnits;
  payload: {
    coordinates: CoordinateDto[];
    actionedAt: string;
  };
};

export { ActionTypeEnum };

export type { ZoomAreaAction, ReviveUnitsAction };
