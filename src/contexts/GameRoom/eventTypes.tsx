import type { AreaDTO, CoordinateDTO, MapSizeDTO, UnitDTO } from '@/dto';

enum EventTypeEnum {
  InformationUpdated = 'INFORMATION_UPDATED',
  UnitsRevived = 'UNITS_REVIVED',
  AreaZoomed = 'AREA_ZOOMED',
  ZoomedAreaUpdated = 'ZOOMED_AREA_UPDATED',
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

type ZoomedAreaUpdatedEventPayload = {
  area: AreaDTO;
  unitMap: UnitDTO[][];
};
type ZoomedAreaUpdatedEvent = {
  type: EventTypeEnum.ZoomedAreaUpdated;
  payload: ZoomedAreaUpdatedEventPayload;
};

type Event = InformationUpdatedEvent | UnitsRevivedEvent | AreaZoomedEvent | ZoomedAreaUpdatedEvent;

export { EventTypeEnum };
export type {
  Event,
  InformationUpdatedEvent,
  UnitsRevivedEvent,
  AreaZoomedEvent,
  AreaZoomedEventPayload,
  ZoomedAreaUpdatedEvent,
  ZoomedAreaUpdatedEventPayload,
};
