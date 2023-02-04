import { LocationDto } from '@/dtos';

enum CommandTypeEnum {
  Ping = 'PING',
  Move = 'MOVE',
  BuildItem = 'BUILD_ITEM',
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

type BuildItemCommand = {
  type: CommandTypeEnum.BuildItem;
  payload: {
    location: LocationDto;
    itemId: string;
    actionedAt: string;
  };
};

type DestroyItemCommand = {
  type: CommandTypeEnum.DestroyItem;
  payload: {
    location: LocationDto;
    actionedAt: string;
  };
};

export { CommandTypeEnum };

export type { PingCommand, MoveCommand, BuildItemCommand, DestroyItemCommand };
