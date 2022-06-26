import type { AreaDTO, CoordinateDTO, MapSizeDTO, UnitDTO } from '@/dto';

enum EventTypeEnum {
  InformationUpdated = 'INFORMATION_UPDATED',
  CoordinatesUpdated = 'COORDINATES_UPDATED',
  AreaUpdated = 'AREA_UPDATED',
}

type InformationUpdatedEvent = {
  type: EventTypeEnum.InformationUpdated;
  payload: {
    mapSize: MapSizeDTO;
  };
};

type CoordinatesUpdatedEvent = {
  type: EventTypeEnum.CoordinatesUpdated;
  payload: {
    coordinates: CoordinateDTO[];
    units: UnitDTO[];
  };
};

type AreaUpdatedEvent = {
  type: EventTypeEnum.AreaUpdated;
  payload: {
    area: AreaDTO;
    units: UnitDTO[][];
  };
};

type Event =
  | InformationUpdatedEvent
  | CoordinatesUpdatedEvent
  | AreaUpdatedEvent;

export { EventTypeEnum };
export type {
  Event,
  InformationUpdatedEvent,
  CoordinatesUpdatedEvent,
  AreaUpdatedEvent,
};
