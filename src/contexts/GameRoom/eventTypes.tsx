import type { AreaDTO, CoordinateDTO, MapSizeDTO, UnitDTO } from '@/dto';

enum EventTypeEnum {
  InformationUpdated = 'INFORMATION_UPDATED',
  UnitsUpdated = 'UNITS_UPDATED',
  UnitMapFetched = 'UNIT_MAP_FETCHED',
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

type Event = InformationUpdatedEvent | UnitsUpdatedEvent | UnitMapFetchedEvent;

export { EventTypeEnum };
export type { Event, InformationUpdatedEvent, UnitsUpdatedEvent, UnitMapFetchedEvent, UnitMapFetchedEventPayload };
