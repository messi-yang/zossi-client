import { Units, Area } from './types';

enum EventType {
  UnitsUpdated = 'UNITS_UPDATED',
  PlayerJoined = 'PLAYER_JOINED',
}

type Event = {
  type: EventType;
  payload: any;
};

interface UnitsUpdatedEvent extends Event {
  type: EventType.UnitsUpdated;
  payload: {
    area: Area;
    units: Units;
  };
}

interface PlayerJoinedEvent extends Event {
  type: EventType.PlayerJoined;
  payload: any;
}

export { EventType };
export type { Event, UnitsUpdatedEvent, PlayerJoinedEvent };
