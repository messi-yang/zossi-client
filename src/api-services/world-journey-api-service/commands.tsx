import { PositionDto } from '@/dtos';

enum CommandTypeEnum {
  Ping = 'PING',
  Move = 'MOVE',
  ChangeHeldItem = 'CHANGE_HELD_ITEM',
  PlaceUnit = 'PLACE_UNIT',
  RemoveUnit = 'REMOVE_UNIT',
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

type PlaceUnitCommand = {
  type: CommandTypeEnum.PlaceUnit;
};

type RemoveUnitCommand = {
  type: CommandTypeEnum.RemoveUnit;
  position: PositionDto;
};

export { CommandTypeEnum };

export type { PingCommand, MoveCommand, ChangeHeldItemCommand, PlaceUnitCommand, RemoveUnitCommand };
