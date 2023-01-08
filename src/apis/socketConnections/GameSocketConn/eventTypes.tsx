import type { RangeDto, MapSizeDto, ItemDto, UnitDto } from '@/apis/dtos';

enum EventTypeEnum {
  InformationUpdated = 'INFORMATION_UPDATED',
  ItemsUpdated = 'ITEMS_UPDATED',
  RangeObserved = 'RANGE_OBSERVED',
  ObservedRangeUpdated = 'OBSERVED_RANGE_UPDATED',
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

type RangeObservedEvent = {
  type: EventTypeEnum.RangeObserved;
  payload: {
    range: RangeDto;
    unitMap: UnitDto[][];
  };
};

type ObservedRangeUpdatedEvent = {
  type: EventTypeEnum.ObservedRangeUpdated;
  payload: {
    range: RangeDto;
    unitMap: UnitDto[][];
    updatedAt: string;
  };
};

type Event = InformationUpdatedEvent | ItemsUpdatedEvent | RangeObservedEvent | ObservedRangeUpdatedEvent;

export { EventTypeEnum };
export type { Event, InformationUpdatedEvent, ItemsUpdatedEvent, RangeObservedEvent, ObservedRangeUpdatedEvent };
