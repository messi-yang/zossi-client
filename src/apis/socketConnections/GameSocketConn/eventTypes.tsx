import type { MapRangeDto, MapSizeDto, ItemDto, GameMapUnitDto } from '@/apis/dtos';

enum EventTypeEnum {
  InformationUpdated = 'INFORMATION_UPDATED',
  ItemsUpdated = 'ITEMS_UPDATED',
  MapRangeZoomed = 'MAP_RANGE_ZOOMED',
  ZoomedMapRangeUpdated = 'ZOOMED_MAP_RANGE_UPDATED',
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

type MapRangeZoomedEvent = {
  type: EventTypeEnum.MapRangeZoomed;
  payload: {
    mapRange: MapRangeDto;
    gameMap: GameMapUnitDto[][];
  };
};

type ZoomedMapRangeUpdatedEvent = {
  type: EventTypeEnum.ZoomedMapRangeUpdated;
  payload: {
    mapRange: MapRangeDto;
    gameMap: GameMapUnitDto[][];
    updatedAt: string;
  };
};

type Event = InformationUpdatedEvent | ItemsUpdatedEvent | MapRangeZoomedEvent | ZoomedMapRangeUpdatedEvent;

export { EventTypeEnum };
export type { Event, InformationUpdatedEvent, ItemsUpdatedEvent, MapRangeZoomedEvent, ZoomedMapRangeUpdatedEvent };
