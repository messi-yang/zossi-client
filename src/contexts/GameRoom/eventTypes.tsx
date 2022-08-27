import type { AreaDTO, CoordinateDTO, MapSizeDTO, UnitDTO } from '@/dto';

enum EventTypeEnum {
  InformationUpdated = 'INFORMATION_UPDATED',
  UnitsUpdated = 'UNITS_UPDATED',
  UnitMapFetched = 'UNIT_MAP_FETCHED',
  UnitMapUpdated = 'UNIT_MAP_UPDATED',
}

type InformationUpdatedEvent = {
  type: EventTypeEnum.InformationUpdated;
  payload: {
    mapSize: MapSizeDTO;
  };
};

type UnitsUpdatedEvent = {
  type: EventTypeEnum.UnitsUpdated;
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

type UnitMapUpdatedEventPayload = {
  area: AreaDTO;
  unitMap: UnitDTO[][];
};
type UnitMapUpdatedEvent = {
  type: EventTypeEnum.UnitMapUpdated;
  payload: UnitMapUpdatedEventPayload;
};

type Event = InformationUpdatedEvent | UnitsUpdatedEvent | UnitMapFetchedEvent | UnitMapUpdatedEvent;

export { EventTypeEnum };
export type {
  Event,
  InformationUpdatedEvent,
  UnitsUpdatedEvent,
  UnitMapFetchedEvent,
  UnitMapFetchedEventPayload,
  UnitMapUpdatedEventPayload,
};
