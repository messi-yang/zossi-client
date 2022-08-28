import type { AreaDTO, CoordinateDTO, MapSizeDTO, UnitDTO } from '@/dto';

enum EventTypeEnum {
  InformationUpdated = 'INFORMATION_UPDATED',
  UnitsRevived = 'UNITS_REVIVED',
  UnitMapReceived = 'UNIT_MAP_RECEIVED',
  UnitMapUpdated = 'UNIT_MAP_UPDATED',
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

type UnitMapUpdatedEventPayload = {
  area: AreaDTO;
  unitMap: UnitDTO[][];
};
type UnitMapUpdatedEvent = {
  type: EventTypeEnum.UnitMapUpdated;
  payload: UnitMapUpdatedEventPayload;
};

type Event = InformationUpdatedEvent | UnitsRevivedEvent | UnitMapReceivedEvent | UnitMapUpdatedEvent;

export { EventTypeEnum };
export type {
  Event,
  InformationUpdatedEvent,
  UnitsRevivedEvent,
  UnitMapReceivedEvent,
  UnitMapReceivedEventPayload,
  UnitMapUpdatedEvent,
  UnitMapUpdatedEventPayload,
};
