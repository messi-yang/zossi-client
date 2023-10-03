import { PositionDto } from '@/apis/dtos';

enum CommandTypeEnum {
  Ping = 'PING',
  Move = 'MOVE',
  ChangeHeldItem = 'CHANGE_HELD_ITEM',
  CreateStaticUnit = 'CREATE_STATIC_UNIT',
  CreatePortalUnit = 'CREATE_PORTAL_UNIT',
  RemoveUnit = 'REMOVE_UNIT',
  RotateUnit = 'ROTATE_UNIT',
}

type PingCommand = {
  type: CommandTypeEnum.Ping;
};

type MoveCommand = {
  type: CommandTypeEnum.Move;
  direction: number;
};

type ChangeHeldItemCommand = {
  type: CommandTypeEnum.ChangeHeldItem;
  itemId: string;
};

type CreateStaticUnitCommand = {
  type: CommandTypeEnum.CreateStaticUnit;
  itemId: string;
  position: PositionDto;
  direction: number;
};

type CreatePortalUnitCommand = {
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
  MoveCommand,
  ChangeHeldItemCommand,
  CreateStaticUnitCommand,
  CreatePortalUnitCommand,
  RemoveUnitCommandDto,
  RotateUnitCommandDto,
};
