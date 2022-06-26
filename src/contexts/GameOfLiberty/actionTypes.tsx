import { AreaDTO } from '@/dto';

enum ActionTypeEnum {
  WatchArea = 'WATCH_AREA',
  ReviveUnits = 'REVIVE_UNITS',
}

type WatchAreaAction = {
  type: ActionTypeEnum.WatchArea;
  payload: {
    area: AreaDTO;
  };
};

type ReviveUnitsAction = {
  type: ActionTypeEnum.ReviveUnits;
  payload: {};
};

export { ActionTypeEnum };

export type { WatchAreaAction, ReviveUnitsAction };
