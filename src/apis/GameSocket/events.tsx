import type { ItemDto, PlayerDto, ViewDto } from '@/dtos';

enum EventTypeEnum {
  GameJoined = 'GAME_JOINED',
  PlayersUpdated = 'PLAYERS_UPDATED',
  ViewUpdated = 'VIEW_UPDATED',
}

type GameJoinedEvent = {
  type: EventTypeEnum.GameJoined;
  payload: {
    playerId: string;
    players: PlayerDto[];
    view: ViewDto;
    items: ItemDto[];
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

type Event = GameJoinedEvent | PlayersUpdatedEvent | ViewUpdatedEvent;

export { EventTypeEnum };
export type { Event, GameJoinedEvent, PlayersUpdatedEvent, ViewUpdatedEvent };
