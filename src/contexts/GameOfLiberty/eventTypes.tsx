import { Units, Area, MapSize } from './types';

enum EventType {
  InformationUpdated = 'INFORMATION_UPDATED',
  UnitsUpdated = 'UNITS_UPDATED',
  PlayerJoined = 'PLAYER_JOINED',
}

type InformationUpdatedEvent = {
  type: EventType.InformationUpdated;
  payload: {
    mapSize: MapSize;
    playersCount: number;
  };
};

type UnitsUpdatedEvent = {
  type: EventType.UnitsUpdated;
  payload: {
    area: Area;
    units: Units;
  };
};

type PlayerJoinedEvent = {
  type: EventType.PlayerJoined;
  payload: any;
};

type Event = InformationUpdatedEvent | UnitsUpdatedEvent | PlayerJoinedEvent;

export { EventType };
export type {
  Event,
  InformationUpdatedEvent,
  UnitsUpdatedEvent,
  PlayerJoinedEvent,
};
