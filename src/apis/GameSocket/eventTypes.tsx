import type { SizeDto, ItemDto } from '@/dtos';
import CameraDto from '@/dtos/CameraDto';
import PlayerDto from '@/dtos/PlayerDto';
import ViewDto from '@/dtos/ViewDto';

enum EventTypeEnum {
  GameJoined = 'GAME_JOINED',
  PlayerUpdated = 'PLAYER_UPDATED',
  ViewChanged = 'VIEW_CHANGED',
  ViewUpdated = 'VIEW_UPDATED',
  ItemsUpdated = 'ITEMS_UPDATED',
}

type GameJoinedEvent = {
  type: EventTypeEnum.GameJoined;
  payload: {
    player: PlayerDto;
    mapSize: SizeDto;
    view: ViewDto;
    camera: CameraDto;
  };
};

type PlayerUpdatedEvent = {
  type: EventTypeEnum.PlayerUpdated;
  payload: {
    player: PlayerDto;
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

type Event = GameJoinedEvent | PlayerUpdatedEvent | ViewChangedEvent | ViewUpdatedEvent | ItemsUpdatedEvent;

export { EventTypeEnum };
export type { Event, GameJoinedEvent, PlayerUpdatedEvent, ViewChangedEvent, ViewUpdatedEvent, ItemsUpdatedEvent };
