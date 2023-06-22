enum CommandTypeEnum {
  Ping = 'PING',
  Move = 'MOVE',
  ChangeHeldItem = 'CHANGE_HELD_ITEM',
  PlaceItem = 'PLACE_ITEM',
  RemoveItem = 'REMOVE_ITEM',
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

type PlaceItemCommand = {
  type: CommandTypeEnum.PlaceItem;
};

type RemoveItemCommand = {
  type: CommandTypeEnum.RemoveItem;
};

export { CommandTypeEnum };

export type { PingCommand, MoveCommand, ChangeHeldItemCommand, PlaceItemCommand, RemoveItemCommand };
