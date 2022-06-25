import { Unit, Units, Area, MapSize, Coordinate } from './types';

enum EventType {
  InformationUpdated = 'INFORMATION_UPDATED',
  UnitsUpdated = 'UNITS_UPDATED',
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

type UnitsUpdatedEvent = {
  type: EventType.UnitsUpdated;
  payload: {
    coordinates: Coordinate[];
    units: Unit[];
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

type Event =
  | InformationUpdatedEvent
  | UnitsUpdatedEvent
  | AreaUpdatedEvent
  | PlayerJoinedEvent;

export { EventType };
export type {
  Event,
  InformationUpdatedEvent,
  UnitsUpdatedEvent,
  AreaUpdatedEvent,
  PlayerJoinedEvent,
};
