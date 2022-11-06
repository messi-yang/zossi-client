import type { AreaDto, DimensionDto, UnitDto } from '@/dtos';

enum EventTypeEnum {
  InformationUpdated = 'INFORMATION_UPDATED',
  AreaZoomed = 'AREA_ZOOMED',
  ZoomedAreaUpdated = 'ZOOMED_AREA_UPDATED',
}

type InformationUpdatedEvent = {
  type: EventTypeEnum.InformationUpdated;
  payload: {
    dimension: DimensionDto;
  };
};

type AreaZoomedEventPayload = {
  area: AreaDto;
  unitMap: UnitDto[][];
};
type AreaZoomedEvent = {
  type: EventTypeEnum.AreaZoomed;
  payload: AreaZoomedEventPayload;
};

type ZoomedAreaUpdatedEventPayload = {
  area: AreaDto;
  unitMap: UnitDto[][];
  updatedAt: string;
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
