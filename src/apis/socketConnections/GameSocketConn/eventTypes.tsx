import type { DimensionDto, ItemDto } from '@/apis/dtos';
import CameraDto from '@/apis/dtos/CameraDto';
import ViewDto from '@/apis/dtos/ViewDto';

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
    dimension: DimensionDto;
    view: ViewDto;
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
