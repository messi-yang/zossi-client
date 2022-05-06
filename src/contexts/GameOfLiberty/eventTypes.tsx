import { Units, Area, MapSize } from './types';

enum EventType {
  InformationUpdated = 'INFORMATION_UPDATED',
  AreaUpdated = 'AREA_UPDATED',
  PlayerJoined = 'PLAYER_JOINED',
}

type InformationUpdatedEvent = {
  type: EventType.InformationUpdated;
  payload: {
    mapSize: MapSize;
    playersCount: number;
  };
};

type AreaUpdatedEvent = {
  type: EventType.AreaUpdated;
  payload: {
    area: Area;
    units: Units;
  };
};

type PlayerJoinedEvent = {
  type: EventType.PlayerJoined;
  payload: any;
};

type Event = InformationUpdatedEvent | AreaUpdatedEvent | PlayerJoinedEvent;

export { EventType };
export type {
  Event,
  InformationUpdatedEvent,
  AreaUpdatedEvent,
  PlayerJoinedEvent,
};
