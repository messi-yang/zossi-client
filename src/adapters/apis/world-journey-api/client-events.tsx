import { CommandDto } from './commands';

enum ClientEventNameEnum {
  Ping = 'PING',
  CommandRequested = 'COMMAND_REQUESTED',
  P2pOfferSent = 'P2P_OFFER_SENT',
  P2pAnswerSent = 'P2P_ANSWER_SENT',
}

type PingClientEvent = {
  name: ClientEventNameEnum.Ping;
};

type CommandRequestedClientEvent = {
  name: ClientEventNameEnum.CommandRequested;
  command: CommandDto;
};

type P2pOfferSentClientEvent = {
  name: ClientEventNameEnum.P2pOfferSent;
  peerPlayerId: string;
  iceCandidates: object[];
  offer: object;
};

type P2pAnswerSentClientEvent = {
  name: ClientEventNameEnum.P2pAnswerSent;
  peerPlayerId: string;
  iceCandidates: object[];
  answer: object;
};

type ClientEvent = CommandRequestedClientEvent | P2pOfferSentClientEvent | P2pAnswerSentClientEvent;

export { ClientEventNameEnum };
export type {
  ClientEvent,
  PingClientEvent,
  CommandRequestedClientEvent,
  P2pOfferSentClientEvent,
  P2pAnswerSentClientEvent,
};
