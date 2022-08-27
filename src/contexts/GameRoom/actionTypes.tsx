import { AreaDTO, CoordinateDTO } from '@/dto';

enum ActionTypeEnum {
  WatchArea = 'WATCH_AREA',
  ReviveUnits = 'REVIVE_UNITS',
}

type WatchAreaAction = {
  type: ActionTypeEnum.WatchArea;
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

export type { WatchAreaAction, ReviveUnitsAction };
