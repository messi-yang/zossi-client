import { LocationDto } from '@/dtos';

enum ActionTypeEnum {
  Ping = 'PING',
  Move = 'MOVE',
  BuildItem = 'BUILD_ITEM',
  DestroyItem = 'DESTROY_ITEM',
}

type PingAction = {
  type: ActionTypeEnum.Ping;
};

type MoveAction = {
  type: ActionTypeEnum.Move;
  payload: {
    direction: number;
  };
};

type BuildItemAction = {
  type: ActionTypeEnum.BuildItem;
  payload: {
    location: LocationDto;
    itemId: string;
    actionedAt: string;
  };
};

type DestroyItemAction = {
  type: ActionTypeEnum.DestroyItem;
  payload: {
    location: LocationDto;
    actionedAt: string;
  };
};

export { ActionTypeEnum };

export type { PingAction, MoveAction, BuildItemAction, DestroyItemAction };
