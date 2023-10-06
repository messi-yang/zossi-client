import { PlayerDto, PositionDto, UnitDto, WorldDto } from '@/apis/dtos';

enum CommandNameEnum {
  Ping = 'PING',
  DisplayError = 'DISPLAY_ERROR',
  EnterWorld = 'ENTER_WORLD',
  AddPlayer = 'ADD_PLAYER',
  RemovePlayer = 'REMOVE_PLAYER',
  MovePlayer = 'MOVE_PLAYER',
  ChangePlayerHeldItem = 'CHANGE_PLAYER_HELD_ITEM',
  CreateStaticUnit = 'CREATE_STATIC_UNIT',
  CreatePortalUnit = 'CREATE_PORTAL_UNIT',
  RemoveUnit = 'REMOVE_UNIT',
  RotateUnit = 'ROTATE_UNIT',
}

type PingCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.Ping;
};

type EnterWorldCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.EnterWorld;
  world: WorldDto;
  units: UnitDto[];
  myPlayerId: string;
  players: PlayerDto[];
};

type AddPlayerCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.AddPlayer;
  player: PlayerDto;
};

type MovePlayerCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.MovePlayer;
  playerId: string;
  position: PositionDto;
  direction: number;
};

type RemovePlayerCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.RemovePlayer;
  playerId: string;
};

type ChangePlayerHeldItemCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.ChangePlayerHeldItem;
  playerId: string;
  itemId: string;
};

type CreateStaticUnitCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.CreateStaticUnit;
  itemId: string;
  position: PositionDto;
  direction: number;
};

type CreatePortalUnitCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.CreatePortalUnit;
  itemId: string;
  position: PositionDto;
  direction: number;
};

type RemoveUnitCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.RemoveUnit;
  position: PositionDto;
};

type RotateUnitCommandDto = {
  id: string;
  timestamp: number;
  name: CommandNameEnum.RotateUnit;
  position: PositionDto;
};

export { CommandNameEnum };

export type Command =
  | PingCommandDto
  | EnterWorldCommandDto
  | AddPlayerCommandDto
  | MovePlayerCommandDto
  | RemovePlayerCommandDto
  | ChangePlayerHeldItemCommandDto
  | CreateStaticUnitCommandDto
  | CreatePortalUnitCommandDto
  | RemoveUnitCommandDto
  | RotateUnitCommandDto;

export type {
  PingCommandDto,
  EnterWorldCommandDto,
  AddPlayerCommandDto,
  MovePlayerCommandDto,
  RemovePlayerCommandDto,
  ChangePlayerHeldItemCommandDto,
  CreateStaticUnitCommandDto,
  CreatePortalUnitCommandDto,
  RemoveUnitCommandDto,
  RotateUnitCommandDto,
};
