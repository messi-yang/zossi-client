import { PositionDto } from '@/apis/dtos';

enum CommandTypeEnum {
  Ping = 'PING',
  MovePlayer = 'MOVE_PLAYER',
  ChangePlayerHeldItem = 'CHANGE_PLAYER_HELD_ITEM',
  CreateStaticUnit = 'CREATE_STATIC_UNIT',
  CreatePortalUnit = 'CREATE_PORTAL_UNIT',
  RemoveUnit = 'REMOVE_UNIT',
  RotateUnit = 'ROTATE_UNIT',
}

type PingCommand = {
  type: CommandTypeEnum.Ping;
};

type MovePlayerCommandDto = {
  type: CommandTypeEnum.MovePlayer;
  playerId: string;
  position: PositionDto;
  direction: number;
};

type ChangePlayerHeldItemCommandDto = {
  type: CommandTypeEnum.ChangePlayerHeldItem;
  playerId: string;
  itemId: string;
};

type CreateStaticUnitCommandDto = {
  type: CommandTypeEnum.CreateStaticUnit;
  itemId: string;
  position: PositionDto;
  direction: number;
};

type CreatePortalUnitCommandDto = {
  type: CommandTypeEnum.CreatePortalUnit;
  itemId: string;
  position: PositionDto;
  direction: number;
};

type RemoveUnitCommandDto = {
  type: CommandTypeEnum.RemoveUnit;
  position: PositionDto;
};

type RotateUnitCommandDto = {
  type: CommandTypeEnum.RotateUnit;
  position: PositionDto;
};

export { CommandTypeEnum };

export type {
  PingCommand,
  MovePlayerCommandDto,
  ChangePlayerHeldItemCommandDto,
  CreateStaticUnitCommandDto,
  CreatePortalUnitCommandDto,
  RemoveUnitCommandDto,
  RotateUnitCommandDto,
};
