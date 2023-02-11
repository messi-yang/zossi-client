import type { SizeDto, ItemDto, PlayerDto, ViewDto } from '@/dtos';

enum EventTypeEnum {
  GameJoined = 'GAME_JOINED',
  PlayersUpdated = 'PLAYERS_UPDATED',
  ViewUpdated = 'VIEW_UPDATED',
  ItemsUpdated = 'ITEMS_UPDATED',
}

type GameJoinedEvent = {
  type: EventTypeEnum.GameJoined;
  payload: {
    playerId: string;
    players: PlayerDto[];
    player: PlayerDto;
    mapSize: SizeDto;
    view: ViewDto;
  };
};

type PlayersUpdatedEvent = {
  type: EventTypeEnum.PlayersUpdated;
  payload: {
    players: PlayerDto[];
  };
};

type ViewUpdatedEvent = {
  type: EventTypeEnum.ViewUpdated;
  payload: {
    view: ViewDto;
  };
};

type ItemsUpdatedEvent = {
  type: EventTypeEnum.ItemsUpdated;
  payload: {
    items: ItemDto[];
  };
};

type Event = GameJoinedEvent | PlayersUpdatedEvent | ViewUpdatedEvent | ItemsUpdatedEvent;

export { EventTypeEnum };
export type { Event, GameJoinedEvent, PlayersUpdatedEvent, ViewUpdatedEvent, ItemsUpdatedEvent };
