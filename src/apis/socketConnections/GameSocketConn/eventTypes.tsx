import type { MapRangeDto, MapSizeDto, ItemDto, MapUnitDto } from '@/apis/dtos';

enum EventTypeEnum {
  InformationUpdated = 'INFORMATION_UPDATED',
  ItemsUpdated = 'ITEMS_UPDATED',
  MapRangeObserved = 'MAP_RANGE_OBSERVED',
  ObservedMapRangeUpdated = 'OBSERVED_MAP_RANGE_UPDATED',
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

type MapRangeObservedEvent = {
  type: EventTypeEnum.MapRangeObserved;
  payload: {
    mapRange: MapRangeDto;
    gameMap: MapUnitDto[][];
  };
};

type ObservedMapRangeUpdatedEvent = {
  type: EventTypeEnum.ObservedMapRangeUpdated;
  payload: {
    mapRange: MapRangeDto;
    gameMap: MapUnitDto[][];
    updatedAt: string;
  };
};

type Event = InformationUpdatedEvent | ItemsUpdatedEvent | MapRangeObservedEvent | ObservedMapRangeUpdatedEvent;

export { EventTypeEnum };
export type { Event, InformationUpdatedEvent, ItemsUpdatedEvent, MapRangeObservedEvent, ObservedMapRangeUpdatedEvent };
