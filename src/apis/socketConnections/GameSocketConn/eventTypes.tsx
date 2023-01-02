import type { AreaDto, DimensionDto, ItemDto, UnitDto } from '@/apis/dtos';

enum EventTypeEnum {
  InformationUpdated = 'INFORMATION_UPDATED',
  ItemsUpdated = 'ITEMS_UPDATED',
  AreaZoomed = 'AREA_ZOOMED',
  ZoomedAreaUpdated = 'ZOOMED_AREA_UPDATED',
}

type InformationUpdatedEvent = {
  type: EventTypeEnum.InformationUpdated;
  payload: {
    dimension: DimensionDto;
  };
};

type ItemsUpdatedEvent = {
  type: EventTypeEnum.ItemsUpdated;
  payload: {
    items: ItemDto[];
  };
};

type AreaZoomedEvent = {
  type: EventTypeEnum.AreaZoomed;
  payload: {
    area: AreaDto;
    unitBlock: UnitDto[][];
  };
};

type ZoomedAreaUpdatedEvent = {
  type: EventTypeEnum.ZoomedAreaUpdated;
  payload: {
    area: AreaDto;
    unitBlock: UnitDto[][];
    updatedAt: string;
  };
};

type Event = InformationUpdatedEvent | ItemsUpdatedEvent | AreaZoomedEvent | ZoomedAreaUpdatedEvent;

export { EventTypeEnum };
export type { Event, InformationUpdatedEvent, ItemsUpdatedEvent, AreaZoomedEvent, ZoomedAreaUpdatedEvent };
