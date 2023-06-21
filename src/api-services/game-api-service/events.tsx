import type { PlayerDto, UnitDto } from '@/dtos';

enum EventTypeEnum {
  WorldEntered = 'WORLD_ENTERED',
  PlayersUpdated = 'PLAYERS_UPDATED',
  UnitsUpdated = 'UNITS_UPDATED',
}

type WorldEnteredEvent = {
  type: EventTypeEnum.WorldEntered;
  units: UnitDto[];
  myPlayer: PlayerDto;
  otherPlayers: PlayerDto[];
};

type PlayersUpdatedEvent = {
  type: EventTypeEnum.PlayersUpdated;
  myPlayer: PlayerDto;
  otherPlayers: PlayerDto[];
};

type UnitsUpdatedEvent = {
  type: EventTypeEnum.UnitsUpdated;
  units: UnitDto[];
};

type Event = WorldEnteredEvent | PlayersUpdatedEvent | UnitsUpdatedEvent;

export { EventTypeEnum };
export type { Event, WorldEnteredEvent, PlayersUpdatedEvent, UnitsUpdatedEvent };
