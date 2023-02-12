import type { ItemDto, PlayerDto, ViewDto } from '@/dtos';

enum EventTypeEnum {
  GameJoined = 'GAME_JOINED',
  PlayersUpdated = 'PLAYERS_UPDATED',
  ViewUpdated = 'VIEW_UPDATED',
}

type GameJoinedEvent = {
  type: EventTypeEnum.GameJoined;
  playerId: string;
  players: PlayerDto[];
  view: ViewDto;
  items: ItemDto[];
};

type PlayersUpdatedEvent = {
  type: EventTypeEnum.PlayersUpdated;
  players: PlayerDto[];
};

type ViewUpdatedEvent = {
  type: EventTypeEnum.ViewUpdated;
  view: ViewDto;
};

type Event = GameJoinedEvent | PlayersUpdatedEvent | ViewUpdatedEvent;

export { EventTypeEnum };
export type { Event, GameJoinedEvent, PlayersUpdatedEvent, ViewUpdatedEvent };
