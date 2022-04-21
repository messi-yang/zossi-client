import { Coordinate, Area } from './types';

type WatchGameBlockAction = {
  type: 'WATCH_GAME_BLOCK';
  payload: {
    area: Area;
  };
};

type UpdateGameBlockAction = {
  type: 'UPDATE_GAME_BLOCK';
  payload: {
    from: Coordinate;
    to: Coordinate;
  };
};

export type { WatchGameBlockAction, UpdateGameBlockAction };
