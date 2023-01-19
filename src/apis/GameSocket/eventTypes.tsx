import type { SizeDto, ItemDto } from '@/dtos';
import CameraDto from '@/dtos/CameraDto';
import ViewDto from '@/dtos/ViewDto';

enum EventTypeEnum {
  GameJoined = 'GAME_JOINED',
  CameraChanged = 'CAMERA_CHANGED',
  ViewChanged = 'VIEW_CHANGED',
  ViewUpdated = 'VIEW_UPDATED',
  ItemsUpdated = 'ITEMS_UPDATED',
}

type GameJoinedEvent = {
  type: EventTypeEnum.GameJoined;
  payload: {
    playerId: string;
    mapSize: SizeDto;
    view: ViewDto;
    camera: CameraDto;
  };
};

type CameraChangedEvent = {
  type: EventTypeEnum.CameraChanged;
  payload: {
    camera: CameraDto;
  };
};

type ViewChangedEvent = {
  type: EventTypeEnum.ViewChanged;
  payload: {
    view: ViewDto;
  };
};

type ViewUpdatedEvent = {
  type: EventTypeEnum.ViewUpdated;
  payload: {
    view: ViewDto;
  };
};

type ItemsUpdatedEvent = {
  type: EventTypeEnum.ItemsUpdated;
  payload: {
    items: ItemDto[];
  };
};

type Event = GameJoinedEvent | CameraChangedEvent | ViewChangedEvent | ViewUpdatedEvent | ItemsUpdatedEvent;

export { EventTypeEnum };
export type { Event, GameJoinedEvent, CameraChangedEvent, ViewChangedEvent, ViewUpdatedEvent, ItemsUpdatedEvent };
