import type { AreaDTO, CoordinateDTO, MapSizeDTO, UnitDTO } from '@/dto';

enum EventType {
  InformationUpdated = 'INFORMATION_UPDATED',
  UnitsUpdated = 'UNITS_UPDATED',
  AreaUpdated = 'AREA_UPDATED',
  PlayerJoined = 'PLAYER_JOINED',
}

type InformationUpdatedEvent = {
  type: EventType.InformationUpdated;
  payload: {
    mapSize: MapSizeDTO;
    playersCount: number;
  };
};

type UnitsUpdatedEvent = {
  type: EventType.UnitsUpdated;
  payload: {
    coordinates: CoordinateDTO[];
    units: UnitDTO[];
  };
};

type AreaUpdatedEvent = {
  type: EventType.AreaUpdated;
  payload: {
    area: AreaDTO;
    units: UnitDTO[][];
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
