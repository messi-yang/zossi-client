import type { RangeDto, DimensionDto, ItemDto, UnitDto } from '@/apis/dtos';

enum EventTypeEnum {
  GameJoined = 'GAME_JOINED',
  ItemsUpdated = 'ITEMS_UPDATED',
  RangeObserved = 'RANGE_OBSERVED',
  ObservedRangeUpdated = 'OBSERVED_RANGE_UPDATED',
}

type GameJoinedEvent = {
  type: EventTypeEnum.GameJoined;
  payload: {
    playerId: string;
    dimension: DimensionDto;
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
    map: UnitDto[][];
  };
};

type ObservedRangeUpdatedEvent = {
  type: EventTypeEnum.ObservedRangeUpdated;
  payload: {
    range: RangeDto;
    map: UnitDto[][];
    updatedAt: string;
  };
};

type Event = GameJoinedEvent | ItemsUpdatedEvent | RangeObservedEvent | ObservedRangeUpdatedEvent;

export { EventTypeEnum };
export type { Event, GameJoinedEvent, ItemsUpdatedEvent, RangeObservedEvent, ObservedRangeUpdatedEvent };
