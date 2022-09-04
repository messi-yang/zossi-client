import type { AreaDTO, CoordinateDTO, MapSizeDTO, UnitDTO } from '@/dto';

enum EventTypeEnum {
  InformationUpdated = 'INFORMATION_UPDATED',
  UnitsRevived = 'UNITS_REVIVED',
  AreaZoomed = 'AREA_ZOOMED',
  UnitMapTicked = 'UNIT_MAP_TICKED',
}

type InformationUpdatedEvent = {
  type: EventTypeEnum.InformationUpdated;
  payload: {
    mapSize: MapSizeDTO;
  };
};

type UnitsRevivedEvent = {
  type: EventTypeEnum.UnitsRevived;
  payload: {
    coordinates: CoordinateDTO[];
    units: UnitDTO[];
  };
};

type AreaZoomedEventPayload = {
  area: AreaDTO;
  unitMap: UnitDTO[][];
};
type AreaZoomedEvent = {
  type: EventTypeEnum.AreaZoomed;
  payload: AreaZoomedEventPayload;
};

type UnitMapTickedEventPayload = {
  area: AreaDTO;
  unitMap: UnitDTO[][];
};
type UnitMapTickedEvent = {
  type: EventTypeEnum.UnitMapTicked;
  payload: UnitMapTickedEventPayload;
};

type Event = InformationUpdatedEvent | UnitsRevivedEvent | AreaZoomedEvent | UnitMapTickedEvent;

export { EventTypeEnum };
export type {
  Event,
  InformationUpdatedEvent,
  UnitsRevivedEvent,
  AreaZoomedEvent,
  AreaZoomedEventPayload,
  UnitMapTickedEvent,
  UnitMapTickedEventPayload,
};
