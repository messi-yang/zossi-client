import { Area } from './types';

type WatchAreaAction = {
  type: 'WATCH_AREA';
  payload: {
    area: Area;
  };
};

type ReviveUnitsAction = {
  type: 'REVIVE_UNITS';
  payload: {};
};

export type { WatchAreaAction, ReviveUnitsAction };
