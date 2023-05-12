import type { BoundDto, PlayerDto, UnitDto } from '@/apis/dtos';

enum EventTypeEnum {
  PlayersUpdated = 'PLAYERS_UPDATED',
  UnitsUpdated = 'UNITS_UPDATED',
}

type PlayersUpdatedEvent = {
  type: EventTypeEnum.PlayersUpdated;
  myPlayer: PlayerDto;
  otherPlayers: PlayerDto[];
};

type UnitsUpdatedEvent = {
  type: EventTypeEnum.UnitsUpdated;
  visionBound: BoundDto;
  units: UnitDto[];
};

type Event = PlayersUpdatedEvent | UnitsUpdatedEvent;

export { EventTypeEnum };
export type { Event, PlayersUpdatedEvent, UnitsUpdatedEvent };
