import type { ExtentDto, MapSizeDto, ItemDto, UnitDto } from '@/apis/dtos';

enum EventTypeEnum {
  InformationUpdated = 'INFORMATION_UPDATED',
  ItemsUpdated = 'ITEMS_UPDATED',
  ExtentObserved = 'MAP_RANGE_OBSERVED',
  ObservedExtentUpdated = 'OBSERVED_MAP_RANGE_UPDATED',
}

type InformationUpdatedEvent = {
  type: EventTypeEnum.InformationUpdated;
  payload: {
    mapSize: MapSizeDto;
  };
};

type ItemsUpdatedEvent = {
  type: EventTypeEnum.ItemsUpdated;
  payload: {
    items: ItemDto[];
  };
};

type ExtentObservedEvent = {
  type: EventTypeEnum.ExtentObserved;
  payload: {
    extent: ExtentDto;
    unitMap: UnitDto[][];
  };
};

type ObservedExtentUpdatedEvent = {
  type: EventTypeEnum.ObservedExtentUpdated;
  payload: {
    extent: ExtentDto;
    unitMap: UnitDto[][];
    updatedAt: string;
  };
};

type Event = InformationUpdatedEvent | ItemsUpdatedEvent | ExtentObservedEvent | ObservedExtentUpdatedEvent;

export { EventTypeEnum };
export type { Event, InformationUpdatedEvent, ItemsUpdatedEvent, ExtentObservedEvent, ObservedExtentUpdatedEvent };
