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
  payload: {
    direction: number;
  };
};

type PlaceItemCommand = {
  type: CommandTypeEnum.PlaceItem;
  payload: {
    location: LocationDto;
    itemId: string;
  };
};

type DestroyItemCommand = {
  type: CommandTypeEnum.DestroyItem;
  payload: {
    location: LocationDto;
  };
};

export { CommandTypeEnum };

export type { PingCommand, MoveCommand, PlaceItemCommand, DestroyItemCommand };
