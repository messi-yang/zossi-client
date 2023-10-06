import type { WorldDto, PlayerDto, PositionDto, UnitDto } from '@/apis/dtos';

enum EventTypeEnum {
  WorldEntered = 'WORLD_ENTERED',
  StaticUnitCreated = 'STATIC_UNIT_CREATED',
  PortalUnitCreated = 'PORTAL_UNIT_CREATED',
  UnitRotated = 'UNIT_ROTATED',
  UnitRemoved = 'UNIT_REMOVED',
  PlayerJoined = 'PLAYER_JOINED',
  PlayerMoved = 'PLAYER_MOVED',
  PlayerHeldItemChanged = 'PLAYER_HELD_ITEM_CHANGED',
  PlayerLeft = 'PLAYER_LEFT',
}

type WorldEnteredEvent = {
  type: EventTypeEnum.WorldEntered;
  world: WorldDto;
  units: UnitDto[];
  myPlayerId: string;
  players: PlayerDto[];
};

type StaticUnitCreatedEvent = {
  type: EventTypeEnum.StaticUnitCreated;
  itemId: string;
  position: PositionDto;
  direction: number;
};

type PortalUnitCreatedEvent = {
  type: EventTypeEnum.PortalUnitCreated;
  itemId: string;
  position: PositionDto;
  direction: number;
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
  playerId: string;
  position: PositionDto;
  direction: number;
};

type PlayerHeldItemChangedEvent = {
  type: EventTypeEnum.PlayerHeldItemChanged;
  playerId: string;
  itemId: string;
};

type PlayerLeftEvent = {
  type: EventTypeEnum.PlayerLeft;
  playerId: string;
};

type Event =
  | WorldEnteredEvent
  | StaticUnitCreatedEvent
  | PortalUnitCreatedEvent
  | UnitRotatedEvent
  | UnitRemovedEvent
  | PlayerJoinedEvent
  | PlayerMovedEvent
  | PlayerHeldItemChangedEvent
  | PlayerLeftEvent;

export { EventTypeEnum };
export type {
  Event,
  WorldEnteredEvent,
  StaticUnitCreatedEvent,
  PortalUnitCreatedEvent,
  UnitRotatedEvent,
  UnitRemovedEvent,
  PlayerJoinedEvent,
  PlayerMovedEvent,
  PlayerHeldItemChangedEvent,
  PlayerLeftEvent,
};
