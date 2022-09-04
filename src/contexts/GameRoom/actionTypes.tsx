import { AreaDTO, CoordinateDTO } from '@/dto';

enum ActionTypeEnum {
  ZoomArea = 'ZOOM_AREA',
  ReviveUnits = 'REVIVE_UNITS',
}

type ZoomAreaAction = {
  type: ActionTypeEnum.ZoomArea;
  payload: {
    area: AreaDTO;
    actionedAt: string;
  };
};

type ReviveUnitsAction = {
  type: ActionTypeEnum.ReviveUnits;
  payload: {
    coordinates: CoordinateDTO[];
    actionedAt: string;
  };
};

export { ActionTypeEnum };

export type { ZoomAreaAction, ReviveUnitsAction };
