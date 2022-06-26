import type { AreaDTO, CoordinateDTO, MapSizeDTO, UnitDTO } from '@/dto';

enum EventType {
  InformationUpdated = 'INFORMATION_UPDATED',
  UnitsUpdated = 'UNITS_UPDATED',
  AreaUpdated = 'AREA_UPDATED',
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

type Event = InformationUpdatedEvent | UnitsUpdatedEvent | AreaUpdatedEvent;

export { EventType };
export type {
  Event,
  InformationUpdatedEvent,
  UnitsUpdatedEvent,
  AreaUpdatedEvent,
};
