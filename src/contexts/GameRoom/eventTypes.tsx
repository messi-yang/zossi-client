import type { AreaDTO, MapSizeDTO, UnitDTO } from '@/dto';

enum EventTypeEnum {
  InformationUpdated = 'INFORMATION_UPDATED',
  AreaZoomed = 'AREA_ZOOMED',
  ZoomedAreaUpdated = 'ZOOMED_AREA_UPDATED',
}

type InformationUpdatedEvent = {
  type: EventTypeEnum.InformationUpdated;
  payload: {
    mapSize: MapSizeDTO;
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

type Event = InformationUpdatedEvent | AreaZoomedEvent | ZoomedAreaUpdatedEvent;

export { EventTypeEnum };
export type {
  Event,
  InformationUpdatedEvent,
  AreaZoomedEvent,
  AreaZoomedEventPayload,
  ZoomedAreaUpdatedEvent,
  ZoomedAreaUpdatedEventPayload,
};
