import { Area } from './types';

type WatchUnitsAction = {
  type: 'WATCH_UNITS';
  payload: {
    area: Area;
  };
};

type MockAction = {
  type: 'MOCK_ACTION';
  payload: {};
};

export type { WatchUnitsAction, MockAction };
