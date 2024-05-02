import { PlayerDto } from '../dtos/player-dto';
import { UnitDto } from '../dtos/unit-dto';
import { WorldDto } from '../dtos/world-dto';
import { CommandDto } from './commands';

enum ServerEventNameEnum {
  WorldEntered = 'WORLD_ENTERED',
  PlayerJoined = 'PLAYER_JOINED',
  PlayerLeft = 'PLAYER_LEFT',
  CommandSucceeded = 'COMMAND_SUCCEEDED',
  CommandFailed = 'COMMAND_FAILED',
  P2pOfferReceived = 'P2P_OFFER_RECEIVED',
  P2pAnswerReceived = 'P2P_ANSWER_RECEIVED',
  Errored = 'ERRORED',
}

type WorldEnteredServerEvent = {
  name: ServerEventNameEnum.WorldEntered;
  world: WorldDto;
  units: UnitDto[];
  myPlayerId: string;
  players: PlayerDto[];
};

type PlayerJoinedServerEvent = {
  name: ServerEventNameEnum.PlayerJoined;
  player: PlayerDto;
};

type PlayerLeftServerEvent = {
  name: ServerEventNameEnum.PlayerLeft;
  playerId: string;
};

type CommandSucceededServerEvent = {
  name: ServerEventNameEnum.CommandSucceeded;
  command: CommandDto;
};

type CommandFailedServerEvent = {
  name: ServerEventNameEnum.CommandFailed;
  commandId: string;
  errorMessage: string;
};

type P2pOfferReceivedEvent = {
  name: ServerEventNameEnum.P2pOfferReceived;
  peerPlayerId: string;
  iceCandidates: RTCIceCandidate[];
  offer: RTCSessionDescription;
};

type P2pAnswerReceivedEvent = {
  name: ServerEventNameEnum.P2pAnswerReceived;
  peerPlayerId: string;
  iceCandidates: RTCIceCandidate[];
  answer: RTCSessionDescription;
};

type ErroredServerEvent = {
  name: ServerEventNameEnum.Errored;
  message: string;
};

type ServerEvent =
  | WorldEnteredServerEvent
  | PlayerJoinedServerEvent
  | PlayerLeftServerEvent
  | CommandSucceededServerEvent
  | CommandFailedServerEvent
  | P2pOfferReceivedEvent
  | P2pAnswerReceivedEvent
  | ErroredServerEvent;

export { ServerEventNameEnum };
export type {
  ServerEvent,
  WorldEnteredServerEvent,
  PlayerJoinedServerEvent,
  PlayerLeftServerEvent,
  CommandSucceededServerEvent,
  CommandFailedServerEvent,
  P2pOfferReceivedEvent,
  P2pAnswerReceivedEvent,
  ErroredServerEvent,
};
