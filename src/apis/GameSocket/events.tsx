import type { BoundDto, ItemDto, PlayerDto, UnitDto } from '@/dtos';

enum EventTypeEnum {
  GameJoined = 'GAME_JOINED',
  PlayersUpdated = 'PLAYERS_UPDATED',
  ViewUpdated = 'VIEW_UPDATED',
}

type GameJoinedEvent = {
  type: EventTypeEnum.GameJoined;
  playerId: string;
  players: PlayerDto[];
  bound: BoundDto;
  units: UnitDto[];
  items: ItemDto[];
};

type PlayersUpdatedEvent = {
  type: EventTypeEnum.PlayersUpdated;
  players: PlayerDto[];
};

type ViewUpdatedEvent = {
  type: EventTypeEnum.ViewUpdated;
  bound: BoundDto;
  units: UnitDto[];
};

type Event = GameJoinedEvent | PlayersUpdatedEvent | ViewUpdatedEvent;

export { EventTypeEnum };
export type { Event, GameJoinedEvent, PlayersUpdatedEvent, ViewUpdatedEvent };
