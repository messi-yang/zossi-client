import { CommandDto } from './commands';

enum ClientEventNameEnum {
  Ping = 'PING',
  CommandRequested = 'COMMAND_REQUESTED',
}

type PingClientEvent = {
  name: ClientEventNameEnum.Ping;
};

type CommandRequestedClientEvent = {
  name: ClientEventNameEnum.CommandRequested;
  command: CommandDto;
};

type ClientEvent = CommandRequestedClientEvent;

export { ClientEventNameEnum };
export type { ClientEvent, PingClientEvent, CommandRequestedClientEvent };
