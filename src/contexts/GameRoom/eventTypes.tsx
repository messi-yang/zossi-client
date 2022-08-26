import type { AreaDTO, CoordinateDTO, MapSizeDTO, UnitDTO } from '@/dto';

enum EventTypeEnum {
  InformationUpdated = 'INFORMATION_UPDATED',
  CoordinatesUpdated = 'COORDINATES_UPDATED',
  UnitMapFetched = 'UNIT_MAP_FETCHED',
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

type UnitMapFetchedEventPayload = {
  area: AreaDTO;
  unitMap: UnitDTO[][];
};
type UnitMapFetchedEvent = {
  type: EventTypeEnum.UnitMapFetched;
  payload: UnitMapFetchedEventPayload;
};

type Event = InformationUpdatedEvent | CoordinatesUpdatedEvent | UnitMapFetchedEvent;

export { EventTypeEnum };
export type {
  Event,
  InformationUpdatedEvent,
  CoordinatesUpdatedEvent,
  UnitMapFetchedEvent,
  UnitMapFetchedEventPayload,
};
