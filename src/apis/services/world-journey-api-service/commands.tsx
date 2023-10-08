import { PlayerDto, PositionDto, parsePlayerDto } from '@/apis/dtos';
import {
  AddPlayerCommand,
  CreatePortalUnitCommand,
  CreateStaticUnitCommand,
  MovePlayerCommand,
  RemovePlayerCommand,
  RemoveUnitCommand,
  RotateUnitCommand,
  ChangePlayerHeldItemCommand,
} from '@/logics/world-journey/commands';
import { DirectionModel } from '@/models/world/direction-model';
import { PositionModel } from '@/models/world/position-model';

enum CommandNameEnum {
  Ping = 'PING',
  DisplayError = 'DISPLAY_ERROR',
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

function parseCreateStaticCommandDto(command: CreateStaticUnitCommandDto): CreateStaticUnitCommand {
  return CreateStaticUnitCommand.load(
    command.id,
    command.timestamp,
    command.itemId,
    PositionModel.new(command.position.x, command.position.z),
    DirectionModel.new(command.direction)
  );
}

function parseCreatePortalUnitCommand(command: CreatePortalUnitCommandDto): CreatePortalUnitCommand {
  return CreatePortalUnitCommand.load(
    command.id,
    command.timestamp,
    command.itemId,
    PositionModel.new(command.position.x, command.position.z),
    DirectionModel.new(command.direction)
  );
}

function parseRotateUnitCommand(command: RotateUnitCommandDto): RotateUnitCommand {
  return RotateUnitCommand.load(
    command.id,
    command.timestamp,
    PositionModel.new(command.position.x, command.position.z)
  );
}

function parseRemoveUnitCommand(command: RemoveUnitCommandDto): RemoveUnitCommand {
  return RemoveUnitCommand.load(
    command.id,
    command.timestamp,
    PositionModel.new(command.position.x, command.position.z)
  );
}

function parseAddPlayerAddPlayerCommand(command: AddPlayerCommandDto): AddPlayerCommand {
  return AddPlayerCommand.load(command.id, command.timestamp, parsePlayerDto(command.player));
}

function parseMovePlayerCommand(command: MovePlayerCommandDto): MovePlayerCommand {
  return MovePlayerCommand.load(
    command.id,
    command.timestamp,
    command.playerId,
    PositionModel.new(command.position.x, command.position.z),
    DirectionModel.new(command.direction)
  );
}

function parseChangeChangePlayerHeldItemCommand(command: ChangePlayerHeldItemCommandDto): ChangePlayerHeldItemCommand {
  return ChangePlayerHeldItemCommand.load(command.id, command.timestamp, command.playerId, command.itemId);
}

function parseRemoveRemovePlayerCommand(command: RemovePlayerCommandDto): RemovePlayerCommand {
  return RemovePlayerCommand.load(command.id, command.timestamp, command.playerId);
}

export const parseCommandDto = (commandDto: CommandDto) => {
  if (commandDto.name === CommandNameEnum.CreateStaticUnit) {
    return parseCreateStaticCommandDto(commandDto);
  } else if (commandDto.name === CommandNameEnum.CreatePortalUnit) {
    return parseCreatePortalUnitCommand(commandDto);
  } else if (commandDto.name === CommandNameEnum.RotateUnit) {
    return parseRotateUnitCommand(commandDto);
  } else if (commandDto.name === CommandNameEnum.RemoveUnit) {
    return parseRemoveUnitCommand(commandDto);
  } else if (commandDto.name === CommandNameEnum.AddPlayer) {
    return parseAddPlayerAddPlayerCommand(commandDto);
  } else if (commandDto.name === CommandNameEnum.MovePlayer) {
    return parseMovePlayerCommand(commandDto);
  } else if (commandDto.name === CommandNameEnum.ChangePlayerHeldItem) {
    return parseChangeChangePlayerHeldItemCommand(commandDto);
  } else if (commandDto.name === CommandNameEnum.RemovePlayer) {
    return parseRemoveRemovePlayerCommand(commandDto);
  }
  return null;
};

export { CommandNameEnum };

export type CommandDto =
  | PingCommandDto
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
  AddPlayerCommandDto,
  MovePlayerCommandDto,
  RemovePlayerCommandDto,
  ChangePlayerHeldItemCommandDto,
  CreateStaticUnitCommandDto,
  CreatePortalUnitCommandDto,
  RemoveUnitCommandDto,
  RotateUnitCommandDto,
};
