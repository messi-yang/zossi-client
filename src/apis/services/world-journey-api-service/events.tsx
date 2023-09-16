import type { WorldDto, PlayerDto, PositionDto, UnitDto } from '@/apis/dtos';

enum EventTypeEnum {
  WorldEntered = 'WORLD_ENTERED',
  UnitCreated = 'UNIT_CREATED',
  UnitUpdated = 'UNIT_UPDATED',
  UnitDeleted = 'UNIT_DELETED',
  PlayerJoined = 'PLAYER_JOINED',
  PlayerMoved = 'PLAYER_MOVED',
  PlayerLeft = 'PLAYER_LEFT',
}

type WorldEnteredEvent = {
  type: EventTypeEnum.WorldEntered;
  world: WorldDto;
  units: UnitDto[];
  myPlayerId: string;
  players: PlayerDto[];
};

type UnitCreatedEvent = {
  type: EventTypeEnum.UnitCreated;
  unit: UnitDto;
};

type UnitUpdatedEvent = {
  type: EventTypeEnum.UnitUpdated;
  unit: UnitDto;
};

type UnitDeletedEvent = {
  type: EventTypeEnum.UnitDeleted;
  position: PositionDto;
};

type PlayerJoinedEvent = {
  type: EventTypeEnum.PlayerJoined;
  player: PlayerDto;
};

type PlayerMovedEvent = {
  type: EventTypeEnum.PlayerMoved;
  player: PlayerDto;
};

type PlayerLeftEvent = {
  type: EventTypeEnum.PlayerLeft;
  playerId: string;
};

type Event =
  | WorldEnteredEvent
  | UnitCreatedEvent
  | UnitUpdatedEvent
  | UnitDeletedEvent
  | PlayerJoinedEvent
  | PlayerMovedEvent
  | PlayerLeftEvent;

export { EventTypeEnum };
export type {
  Event,
  WorldEnteredEvent,
  UnitCreatedEvent,
  UnitUpdatedEvent,
  UnitDeletedEvent,
  PlayerJoinedEvent,
  PlayerMovedEvent,
  PlayerLeftEvent,
};
