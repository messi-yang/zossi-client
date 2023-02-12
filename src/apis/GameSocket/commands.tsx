import { LocationDto } from '@/dtos';

enum CommandTypeEnum {
  Ping = 'PING',
  Move = 'MOVE',
  PlaceItem = 'PLACE_ITEM',
  DestroyItem = 'DESTROY_ITEM',
}

type PingCommand = {
  type: CommandTypeEnum.Ping;
};

type MoveCommand = {
  type: CommandTypeEnum.Move;
  direction: number;
};

type PlaceItemCommand = {
  type: CommandTypeEnum.PlaceItem;
  location: LocationDto;
  itemId: number;
};

type DestroyItemCommand = {
  type: CommandTypeEnum.DestroyItem;
  location: LocationDto;
};

export { CommandTypeEnum };

export type { PingCommand, MoveCommand, PlaceItemCommand, DestroyItemCommand };
