import type { WorldDto, PlayerDto, UnitDto } from '@/apis/dtos';
import { CommandDto } from './commands';

enum EventNameEnum {
  WorldEntered = 'WORLD_ENTERED',
  CommandSucceeded = 'COMMAND_SUCCEEDED',
  Errored = 'ERRORED',
}

type WorldEnteredEvent = {
  name: EventNameEnum.WorldEntered;
  world: WorldDto;
  units: UnitDto[];
  myPlayerId: string;
  players: PlayerDto[];
};

type CommandSucceededEvent = {
  name: EventNameEnum.CommandSucceeded;
  command: CommandDto;
};

type ErroredEvent = {
  name: EventNameEnum.Errored;
  message: string;
};

type Event = WorldEnteredEvent | CommandSucceededEvent | ErroredEvent;

export { EventNameEnum };
export type { Event, WorldEnteredEvent, CommandSucceededEvent, ErroredEvent };
