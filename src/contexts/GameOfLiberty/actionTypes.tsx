import { AreaDTO } from '@/dto';

type WatchAreaAction = {
  type: 'WATCH_AREA';
  payload: {
    area: AreaDTO;
  };
};

type ReviveUnitsAction = {
  type: 'REVIVE_UNITS';
  payload: {};
};

export type { WatchAreaAction, ReviveUnitsAction };
