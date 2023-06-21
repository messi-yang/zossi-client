import type { PlayerDto, PositionDto, UnitDto } from '@/dtos';

enum EventTypeEnum {
  WorldEntered = 'WORLD_ENTERED',
  UnitCreated = 'UNIT_CREATED',
  UnitDeleted = 'UNIT_DELETED',
  PlayersUpdated = 'PLAYERS_UPDATED',
  UnitsUpdated = 'UNITS_UPDATED',
}

type WorldEnteredEvent = {
  type: EventTypeEnum.WorldEntered;
  units: UnitDto[];
  myPlayer: PlayerDto;
  otherPlayers: PlayerDto[];
};

type UnitCreatedEvent = {
  type: EventTypeEnum.UnitCreated;
  unit: UnitDto;
};

type UnitDeletedEvent = {
  type: EventTypeEnum.UnitDeleted;
  position: PositionDto;
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

type Event = WorldEnteredEvent | UnitCreatedEvent | UnitDeletedEvent | PlayersUpdatedEvent | UnitsUpdatedEvent;

export { EventTypeEnum };
export type { Event, WorldEnteredEvent, UnitCreatedEvent, UnitDeletedEvent, PlayersUpdatedEvent, UnitsUpdatedEvent };
