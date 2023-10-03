import type { WorldDto, PlayerDto, PositionDto, UnitDto } from '@/apis/dtos';

enum EventTypeEnum {
  WorldEntered = 'WORLD_ENTERED',
  UnitCreated = 'UNIT_CREATED',
  UnitRotated = 'UNIT_ROTATED',
  UnitRemoved = 'UNIT_REMOVED',
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

type UnitRotatedEvent = {
  type: EventTypeEnum.UnitRotated;
  position: PositionDto;
};

type UnitRemovedEvent = {
  type: EventTypeEnum.UnitRemoved;
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
  | UnitRotatedEvent
  | UnitRemovedEvent
  | PlayerJoinedEvent
  | PlayerMovedEvent
  | PlayerLeftEvent;

export { EventTypeEnum };
export type {
  Event,
  WorldEnteredEvent,
  UnitCreatedEvent,
  UnitRotatedEvent,
  UnitRemovedEvent,
  PlayerJoinedEvent,
  PlayerMovedEvent,
  PlayerLeftEvent,
};
