import { Units, Area } from './types';

type GameBlockUpdatedEvent = {
  type: 'GAME_BLOCK_UPDATED';
  payload: {
    area: Area;
    units: Units;
  };
};

type PlayerJoinedEvent = {
  type: 'PLAYER_JOINED';
  payload: any;
};

export type { GameBlockUpdatedEvent, PlayerJoinedEvent };
