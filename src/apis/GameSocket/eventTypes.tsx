import type { SizeDto, ItemDto } from '@/dtos';
import CameraDto from '@/dtos/CameraDto';
import ViewDto from '@/dtos/ViewDto';

enum EventTypeEnum {
  GameJoined = 'GAME_JOINED',
  CameraChanged = 'CAMERA_CHANGED',
  ViewUpdated = 'VIEW_UPDATED',
  ItemsUpdated = 'ITEMS_UPDATED',
}

type GameJoinedEvent = {
  type: EventTypeEnum.GameJoined;
  payload: {
    playerId: string;
    size: SizeDto;
    view: ViewDto;
    camera: CameraDto;
  };
};

type CameraChangedEvent = {
  type: EventTypeEnum.CameraChanged;
  payload: {
    camera: CameraDto;
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

type Event = GameJoinedEvent | CameraChangedEvent | ViewUpdatedEvent | ItemsUpdatedEvent;

export { EventTypeEnum };
export type { Event, GameJoinedEvent, CameraChangedEvent, ViewUpdatedEvent, ItemsUpdatedEvent };
