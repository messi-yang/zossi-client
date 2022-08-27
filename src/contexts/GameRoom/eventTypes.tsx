import type { AreaDTO, CoordinateDTO, MapSizeDTO, UnitDTO } from '@/dto';

enum EventTypeEnum {
  InformationUpdated = 'INFORMATION_UPDATED',
  UnitsUpdated = 'UNITS_UPDATED',
  UnitMapReceived = 'UNIT_MAP_RECEIVED',
  UnitMapUpdated = 'UNIT_MAP_UPDATED',
}

type InformationUpdatedEvent = {
  type: EventTypeEnum.InformationUpdated;
  payload: {
    mapSize: MapSizeDTO;
  };
};

type UnitsUpdatedEvent = {
  type: EventTypeEnum.UnitsUpdated;
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

type Event = InformationUpdatedEvent | UnitsUpdatedEvent | UnitMapReceivedEvent | UnitMapUpdatedEvent;

export { EventTypeEnum };
export type {
  Event,
  InformationUpdatedEvent,
  UnitsUpdatedEvent,
  UnitMapReceivedEvent,
  UnitMapReceivedEventPayload,
  UnitMapUpdatedEvent,
  UnitMapUpdatedEventPayload,
};
