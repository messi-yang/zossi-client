import type { AreaDTO, CoordinateDTO, MapSizeDTO, UnitDTO } from '@/dto';

enum EventTypeEnum {
  InformationUpdated = 'INFORMATION_UPDATED',
  UnitsRevived = 'UNITS_REVIVED',
  UnitMapReceived = 'UNIT_MAP_RECEIVED',
  UnitMapTicked = 'UNIT_MAP_TICKED',
}

type InformationUpdatedEvent = {
  type: EventTypeEnum.InformationUpdated;
  payload: {
    mapSize: MapSizeDTO;
  };
};

type UnitsRevivedEvent = {
  type: EventTypeEnum.UnitsRevived;
  payload: {
    coordinates: CoordinateDTO[];
    units: UnitDTO[];
  };
};

type UnitMapReceivedEventPayload = {
  area: AreaDTO;
  unitMap: UnitDTO[][];
};
type UnitMapReceivedEvent = {
  type: EventTypeEnum.UnitMapReceived;
  payload: UnitMapReceivedEventPayload;
};

type UnitMapTickedEventPayload = {
  area: AreaDTO;
  unitMap: UnitDTO[][];
};
type UnitMapTickedEvent = {
  type: EventTypeEnum.UnitMapTicked;
  payload: UnitMapTickedEventPayload;
};

type Event = InformationUpdatedEvent | UnitsRevivedEvent | UnitMapReceivedEvent | UnitMapTickedEvent;

export { EventTypeEnum };
export type {
  Event,
  InformationUpdatedEvent,
  UnitsRevivedEvent,
  UnitMapReceivedEvent,
  UnitMapReceivedEventPayload,
  UnitMapTickedEvent,
  UnitMapTickedEventPayload,
};
